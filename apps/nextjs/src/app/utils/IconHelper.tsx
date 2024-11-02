import { FaMoneyBills } from "react-icons/fa6";
import { GiBiceps, GiBroom, GiThreeFriends } from "react-icons/gi";
import { IoConstructSharp } from "react-icons/io5";
import { LuConstruction } from "react-icons/lu";
import { MdBusinessCenter } from "react-icons/md";
import { RiMentalHealthFill } from "react-icons/ri";
import { SiApplearcade } from "react-icons/si";

import type { Category } from "~/trpc/types";

export const categoryIconLookup = (category: Category) => {
  switch (category.title) {
    case "Career":
      return <MdBusinessCenter />;
    case "Chores":
      return <GiBroom />;
    case "Entertainment":
      return <SiApplearcade />;
    case "Finance":
      return <FaMoneyBills />;
    case "Friends/Relationships":
      return <GiThreeFriends />;
    case "Health/Fitness":
      return <GiBiceps />;
    case "Home Improvements":
      return <LuConstruction />;
    case "Mindfulness":
      return <RiMentalHealthFill />;
    case "Periodic Maintenance":
      return <IoConstructSharp />;
    default:
      throw Error("Unable to identify category icon for: " + category.title);
  }
};
