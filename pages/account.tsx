import Head from "next/head";
import Link from "next/link";
// import Membership from '../components/Membership'
import useAuth from "../hooks/useAuth";
import { Product, Subscription } from "@/typing";
import app, { db } from "@/firebase";
import getPremiumStatus from "@/lib/getPremiumStatus";
import { useEffect, useState } from "react";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { FirebaseApp } from "firebase/app";
import Membership from "@/components/Membership";

interface Props {
  products: (Product & { prices: { price: string }[] })[];
  subscription: Subscription[];
}

function Account({  }: Props) {
  const { logout } = useAuth();
  const [subscription, setSubscription] = useState({created: {
    seconds: 0}});
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {

    const fetchProducts = async () => {
      const productRef = collection(db, "products");
      const productSnapshot = await getDocs(productRef);
      const productsData = productSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
      setProducts(productsData);
    };

    fetchProducts();

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

  console.log(products);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toUTCString();
  };

  return (
    <div>
      <Head>
        <title>Account Settings - Netflix</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={`bg-[#141414]`}>
        <Link href="/">
          <img
            src="https://rb.gy/ulxxee"
            width={120}
            height={120}
            className="cursor-pointer object-contain"
          />
        </Link>
        <Link href="/account">
          <img
            src="https://rb.gy/g1pwyx"
            alt=""
            className="cursor-pointer rounded"
          />
        </Link>
      </header>

      <main className="mx-auto max-w-6xl px-5 pt-24 pb-12 transition-all md:px-10">
        <div className="flex flex-col gap-x-4 md:flex-row md:items-center">
          <h1 className="text-3xl md:text-4xl">Account</h1>
          <div className="-ml-0.5 flex items-center gap-x-1.5">
            <img src="https://rb.gy/4vfk4r" alt="" className="h-7 w-7" />
            <p className="text-xs font-semibold text-[#555]">
              Member since{" "}
              {subscription.created?.seconds
                ? formatDate(subscription.created.seconds)
                : "N/A"}
            </p>
          </div>
        </div>

        <Membership />

        <div className="mt-6 grid grid-cols-1 gap-x-4 border px-4 py-4 md:grid-cols-4 md:border-x-0 md:border-t md:border-b-0 md:px-0 md:pb-0">
          <h4 className="text-lg text-[gray]">Plan Details</h4>
          {/* Find the current plan */}
          <div className="col-span-2 font-medium">
            {
              products.filter(
                (product) =>
                  product.id === subscription?.product._key.path.segments[6]
              )[0]?.name
            }
          </div>
          <p className="cursor-pointer text-blue-500 hover:underline md:text-right">
            Change plan
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-x-4 border px-4 py-4 md:grid-cols-4 md:border-x-0 md:border-t md:border-b-0 md:px-0">
          <h4 className="text-lg text-[gray]">Settings</h4>
          <p
            className="col-span-3 cursor-pointer text-blue-500 hover:underline"
            onClick={logout}
          >
            Sign out of all devices
          </p>
        </div>
      </main>
    </div>
  );
}

export default Account;


// export const getPlans = async () => {
//   const productRef = collection(db, "products");
//   const productSnapshot = await getDocs(productRef);
//   const products = productSnapshot.docs.map((doc) => ({
//     id: doc.id,
//     ...doc.data(),
//   })) as Product[];

//   const getProductPrice = async (app: FirebaseApp, product: Product) => {
//     const db = getFirestore(app);
//     const pricesRef = collection(db, "products", product.id, "prices");
//     const pricesSnapshot = await getDocs(pricesRef);
//     const prices = pricesSnapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));

//     return prices;
//   };

//   const productPrices = await Promise.all(
//     products.map(async (product) => {
//       const prices = await getProductPrice(app, product);
//       return { ...product, prices };
//     })
//   );

//   return {
//     props:{
//     products: JSON.parse(JSON.stringify(productPrices)),
//     }
//   }
// };