import { InformationItem } from "./InformationItem";
import {
  FaMapMarkedAlt,
  FaCity,
  FaMap,
  FaMailBulk,
  FaRegFlag,
} from "react-icons/fa";
import { userProfile } from "../Item";
import { BiSolidUser, BiMaleFemale } from "react-icons/bi";
import { TbMailFilled } from "react-icons/tb";
import { ImPhone } from "react-icons/im";
import { LiaBirthdayCakeSolid } from "react-icons/lia";

export const ProfileInfo = () => {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-bold text-center lg:text-start md:text-start">
        Profile Information
      </h1>
      <div className="flex flex-col gap-3">
        <InformationItem
          icon={BiSolidUser}
          title="Full Name"
          username={userProfile.username}
          description={userProfile.fullName}
        />
        <InformationItem
          icon={TbMailFilled}
          title="Email Address"
          description={userProfile.email}
        />
        <InformationItem
          icon={ImPhone}
          title="Phone Number"
          description={userProfile.phoneNumber}
        />
        <InformationItem
          icon={LiaBirthdayCakeSolid}
          title="Birthday"
          description={userProfile.birthday}
        />
        <InformationItem
          icon={BiMaleFemale}
          title="Gender"
          description={userProfile.gender}
        />
      </div>
    </div>
  );
};
