import { modalState } from "@/atoms/modalAtom";
import Banner from "@/components/Banner";
import Header from "@/components/Header";
import Modal from "@/components/Modal";
import Plans from "@/components/Plans";
import Row from "@/components/Row";
import useAuth from "@/hooks/useAuth";
import { Movie, Product } from "@/typing";
import requests from "@/utils/requests";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import Head from "next/head";
import { useRecoilValue } from "recoil";
import app, { db } from "@/firebase";
import { FirebaseApp } from "firebase/app";

interface Props {
  netflixOriginals: Movie[];
  trendingNow: Movie[];
  topRated: Movie[];
  actionMovies: Movie[];
  comedyMovies: Movie[];
  horrorMovies: Movie[];
  romanceMovies: Movie[];
  documentaries: Movie[];
  products: (Product & { prices: { price: string }[] })[];
}

export default function Home({
  netflixOriginals,
  actionMovies,
  comedyMovies,
  documentaries,
  horrorMovies,
  romanceMovies,
  topRated,
  trendingNow,
  products,
}:
Props) {
  console.log(products);
  const { loading } = useAuth();
  const showModal = useRecoilValue(modalState);
  const subscription = false;

  if (loading || subscription === null) return null;

  if (!subscription) return <Plans />;

  return (
    <div
      className={`relative h-screen bg-gradient-to-b lg:h[140vh] ${
        showModal && "!h-screen overflow-hidden"
      }`}
    >
      <Head>
        <title>Home-Netflix</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="relative pl-4 pb-24 lg:space-y-24 lg:pl-16">
        <Banner netflixOriginals={netflixOriginals} />
        <section className="md:space-y-24">
          <Row title="Trending Now" movies={trendingNow} />
          <Row title="Top Rated" movies={topRated} />
          <Row title="Action Thrillers" movies={actionMovies} />
          {/* My List Component */}
          <Row title="Comedies" movies={comedyMovies} />
          <Row title="Scary Movies" movies={horrorMovies} />
          <Row title="Romance Movies" movies={romanceMovies} />
          <Row title="Documentaries" movies={documentaries} />
        </section>
      </main>
      {showModal && <Modal />}
    </div>
  );
}

export const getServerSideProps = async () => {
  const productRef = collection(db, "products");
  const productSnapshot = await getDocs(productRef);
  const products = productSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Product[];

  const getProductPrice = async (app: FirebaseApp, product: Product) => {
    const db = getFirestore(app);
    const pricesRef = collection(db, "products", product.id, "prices");
    const pricesSnapshot = await getDocs(pricesRef);
    const prices = pricesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  
    return prices;
  };

  const productPrices = await Promise.all(products.map(async (product) => {
    const prices = await getProductPrice(app, product);
    return { ...product, prices };
  }));

  const [
    netflixOriginals,
    trendingNow,
    topRated,
    actionMovies,
    comedyMovies,
    horrorMovies,
    romanceMovies,
    documentaries,
  ] = await Promise.all([
    fetch(requests.fetchNetflixOriginals).then((res) => res.json()),
    fetch(requests.fetchTrending).then((res) => res.json()),
    fetch(requests.fetchTopRated).then((res) => res.json()),
    fetch(requests.fetchActionMovies).then((res) => res.json()),
    fetch(requests.fetchComedyMovies).then((res) => res.json()),
    fetch(requests.fetchHorrorMovies).then((res) => res.json()),
    fetch(requests.fetchRomanceMovies).then((res) => res.json()),
    fetch(requests.fetchDocumentaries).then((res) => res.json()),
  ]);

  return {
    props: {
      netflixOriginals: netflixOriginals.results,
      trendingNow: trendingNow.results,
      topRated: topRated.results,
      actionMovies: actionMovies.results,
      comedyMovies: comedyMovies.results,
      horrorMovies: horrorMovies.results,
      romanceMovies: romanceMovies.results,
      documentaries: documentaries.results,
      products: JSON.parse(JSON.stringify(productPrices)),
    },
  };
};
