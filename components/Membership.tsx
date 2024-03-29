import { useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'
import useSubscription from '../hooks/useSubscription'
import Loader from './Loader'
import { goToBillingPortal } from '@/lib/stripePayment'
import getPremiumStatus from '@/lib/getPremiumStatus'
import app from '@/firebase'
import { Subscription } from '@/typing'


interface Props {
    subscription: Subscription[];
  }

function Membership({ }: Props) {
  const { user } = useAuth()
  const subscriptionCheck = useSubscription(user)
  const [isBillingLoading, setBillingLoading] = useState(false)
  const [subscription, setSubscription] = useState({current_period_end: {
    seconds: 0}});

  useEffect(() => {

    getPremiumStatus(app)
      .then((premiumStatus) => {
        if (premiumStatus.length > 0) {
          setSubscription(premiumStatus[0]);
        } else {
          console.error("No premium subscription found.");
        }
      })
      .catch((error) => {
        console.error("Error retrieving premium status:", error);
      });


  }, []);
  console.log(subscription);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toUTCString();
  };


  const manageSubscription = () => {
    if (subscriptionCheck) {
      setBillingLoading(true)
      goToBillingPortal()
    }
  }

  return (
    <div className="mt-6 grid grid-cols-1 gap-x-4 border px-4 md:grid-cols-4 md:border-x-0 md:border-t md:border-b-0 md:px-0">
      <div className="space-y-2 py-4">
        <h4 className="text-lg text-[gray]">Membership & Billing</h4>
        <button
          disabled={isBillingLoading || !subscriptionCheck}
          className="h-10 w-3/5 whitespace-nowrap bg-gray-300 py-2 text-sm font-medium text-black shadow-md hover:bg-gray-200 md:w-4/5"
          onClick={manageSubscription}
        >
          {isBillingLoading ? (
            <Loader color="dark:fill-[#e50914]" />
          ) : (
            'Cancel Membership'
          )}
        </button>
      </div>

      <div className="col-span-3">
        <div className="flex flex-col justify-between border-b border-white/10 py-4 md:flex-row">
          <div>
            <p className="font-medium">{user?.email}</p>
            <p className="text-[gray]">Password: *********</p>
          </div>
          <div className="md:text-right">
            <p className="membershipLink">Change email</p>
            <p className="membershipLink">Change password</p>
          </div>
        </div>

        <div className="flex flex-col justify-between pt-4 pb-4 md:flex-row md:pb-0">
          <div>
            <p>
            {subscription?.cancel_at_period_end
  ? 'Your membership will end on '
  : 'Your next billing date is '}
{subscription?.current_period_end.seconds
  ? formatDate(subscription.current_period_end.seconds)
  : "N/A"}

            </p>
          </div>
          <div className="md:text-right">
            <p className="membershipLink">Manage payment info</p>
            <p className="membershipLink">Add backup payment method</p>
            <p className="membershipLink">Billing Details</p>
            <p className="membershipLink">Change billing day</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Membership