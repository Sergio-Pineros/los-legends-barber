// Google reviews supplied by the client (transcribed verbatim from screenshots).
export type Review = {
  name: string;
  meta: string;
  rating: number;
  when: string;
  price?: string;
  text: string;
};

export const REVIEWS: Review[] = [
  {
    name: "Brandon Gutzmer",
    meta: "5 reviews",
    rating: 5,
    when: "a month ago",
    price: "$40–50",
    text: "Great cut, great barber, and friendly vibes!",
  },
  {
    name: "Jose Acosta",
    meta: "4 reviews",
    rating: 5,
    when: "3 years ago",
    text: "Best barber shop in the area Eloy and his crew do a great job making you look very sharp, also very patient with kids.",
  },
  {
    name: "mike cherniy",
    meta: "Local Guide · 60 reviews · 3 photos",
    rating: 5,
    when: "a year ago",
    text: "JUAN IS THE MAN been going there for the longest time no complaints what so ever",
  },
  {
    name: "Rafael Torres Sanchez",
    meta: "2 reviews",
    rating: 5,
    when: "3 years ago",
    text: "Amazing barbershop, always give me what I ask for, best in crystal great service!",
  },
  {
    name: "Carlos Sanchez",
    meta: "2 reviews",
    rating: 5,
    when: "3 years ago",
    text: "You always leave feeling like a million bucks 💯 only the best haircuts 👌…",
  },
  {
    name: "Mohamed Sougdali",
    meta: "2 reviews",
    rating: 5,
    when: "3 years ago",
    text: "Best barbershop around! Great service and vibes!…",
  },
  {
    name: "Elian Torres",
    meta: "5 reviews",
    rating: 5,
    when: "2 years ago",
    text: "Best in the city get your cut asap here",
  },
  {
    name: "Orlando Mendoza",
    meta: "1 review",
    rating: 5,
    when: "8 months ago",
    text: "best barbershop in town",
  },
];
