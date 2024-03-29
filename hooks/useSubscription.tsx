import app from "@/firebase";
import getPremiumStatus from "@/lib/getPremiumStatus";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";

function useSubscription(user: User | null) {
  const [subscriptionCheck, setSubscriptionCheck] = useState<boolean | null>(null);

  useEffect(() => {
    const checkPremium = async () => {
      try {
        if (user) {
          const premiumStatusArray = await getPremiumStatus(app);
          if (premiumStatusArray.length > 0) {
            const isActive = premiumStatusArray.some(
              (premiumStatus) => premiumStatus.status === "active"
            );
            setSubscriptionCheck(isActive);
          } else {
            console.error("No premium subscription found.");
            setSubscriptionCheck(false);
          }
        }
      } catch (error) {
        console.error("Error retrieving premium status:", error);
        setSubscriptionCheck(false);
      }
    };

    checkPremium();

    return () => {
    };
  }, [app, user]);

  return subscriptionCheck;
}

export default useSubscription;
