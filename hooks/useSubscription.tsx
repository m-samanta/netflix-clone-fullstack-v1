import app from "@/firebase";
import getPremiumStatus from "@/lib/getPremiumStatus";
import { User, getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
function useSubscription(user: User | null) {
  const auth = getAuth(app);
  const [subscription, setSubscription] = useState<null | boolean>(null);

  
  useEffect(() => {
    if (!user) return;

    const checkPremium = async () => {
      try {
        const newPremiumStatus = await getPremiumStatus(app);
        setSubscription(newPremiumStatus as unknown as boolean);
      } catch (error) {
        console.error("Error checking premium status:", error);
      }
    };

    checkPremium();
    return() => {
        
    }
  }, [app, user]);

  return subscription;
}


export default useSubscription;
