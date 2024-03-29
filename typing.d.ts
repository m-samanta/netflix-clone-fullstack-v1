export interface Genre {
  id: number;
  name: string;
}

export interface Movie {
  title: string;
  backdrop_path: string;
  media_type?: string;
  release_date?: string;
  first_air_date: string;
  genre_ids: number[];
  id: number;
  name: string;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  vote_average: number;
  vote_count: number;
}

export interface Element {
  type:
    | "Bloopers"
    | "Featurette"
    | "Behind the Scenes"
    | "Clip"
    | "Trailer"
    | "Teaser";
}

export interface Product {
  id: string;
  name: string;
  price: number;
  prices: array;
  description: string;
  image: string;
  metadata: array;
}

export interface Subscription {
  status: string;
  created: {
    seconds: number;
  };
  quantity: number;
  product: {
    _key: {
        path: {
            segments: string[];
        };
    };
};
cancel_at_period_end: boolean;
current_period_end: {
  seconds: number;
};
}
