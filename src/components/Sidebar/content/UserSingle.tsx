"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useState } from "react";
import { LoginModalStore } from "../../../../store/LoginModalStore";
import { useRouter } from "next/navigation";

interface props {
  image: string;
  name: string;
  _id: string;
  followers: [];
}
const UserSingle = ({ props, user }: { props: props; user: any }) => {
  const router = useRouter();

  const [followerCnt, setFollowerCnt] = useState<any | null>(
    props?.followers.length
  );
  const [btnText, setBtnText] = useState(
    user?.following.includes(props?._id) ? "Following" : "Follow"
  );

  const { data } = useSession();

  const loginModal: any = LoginModalStore();
  const onFollowBtnClick = async () => {
    if (!data) {
      loginModal.setOpen();
      return;
    }

    setBtnText(btnText == "Following" ? "Follow" : "Following");

    setFollowerCnt(btnText == "Following" ? followerCnt - 1 : followerCnt + 1);

    await axios
      .put(`/api/user/follow?id=${props._id}`)
      .then(() => router.refresh())
      .catch((error: any) => console.log(error.message));
  };

  return (
    <div className="w-full rounded-md flex justify-between items-center mb-2   p-3 shadow-md">
      <div className="flex items-center  gap-3">
        <Image
          src={props?.image}
          alt="user"
          height={30}
          width={30}
          className="rounded-full"
        />

        <div className="">
          <h1 className="text-sm font-bold hover:underline cursor-pointer">
            {props?.name}
          </h1>
          <p className="text-xs tracking-wider">{followerCnt} Followers</p>
        </div>
      </div>
      <button
        className="border  bg-slate-300 p-2 rounded-xl font-semibold  text-xs"
        onClick={onFollowBtnClick}
      >
        {btnText}
      </button>
    </div>
  );
};

export default UserSingle;
