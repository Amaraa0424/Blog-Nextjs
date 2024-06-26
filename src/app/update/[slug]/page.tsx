"use client";

// You need to import our styles for the button to look right. Best to import in the root /layout.tsx but this is fine
import "@uploadthing/react/styles.css";

import { UploadButton } from "../../../utills/uploadthing";

import { useEffect, useState } from "react";
import DropDown from "@/components/DropDown/DropDown";
import { title } from "process";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";

const people = [
  { name: "Choose Category" },
  { name: "Sports" },
  { name: "Entertainment" },
  { name: "Science" },
  { name: "Technology" },
  { name: "Space" },
];

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(people[0]);
  const [btn, setButton] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [postData, setPostData] = useState<any>()

  const [data, setData] = useState({
    title: "",
    content: "",
    image: "",
  });

  const handleSubmit = async () => {
    setLoading(true);

    const response = await axios
      .post("/api/post/create", { ...data, category: selected.name })
      .then(() => {
        setLoading(false);
        router.refresh();
        router.push("/");
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  const fetchPostData = async (id: any) =>{
    const response = await axios
     .get(`http://localhost:3000/api/post/fetch?id=${id}`)
     .then((res) => {
        console.log(res.data.posts)
        setPostData(res.data.posts)
      })
     .catch((error) => {
        console.log(error);
      });
  }

  if(pathname.split("/").pop() !== "uploadbutton" || pathname.split("/").pop() !== "create"){
    const id = pathname.split("/").pop()
    useEffect(()=>{
      fetchPostData(id)
    }, [])
  }

  const handleUpdate = async () => {
    setLoading(true);

    const response = await axios.put(`/api/post/update`, {
      title: (data.title == "" || data.title == postData.title ? postData.title : data.title),
      content: (data.content == "" || data.content == postData.content ? postData.content : data.content),
      image: (data.image == "" || data.image == postData.image ? postData.image : postData.image),
      id: pathname.split("/").pop(),
      category: selected.name,
    })
     .then(() => {
        setLoading(false);
        router.refresh();
        router.push("/");
      })
  };
  if(!postData && pathname.split("/").pop() !== "create"){
    return <div>Loading...</div>
  } else {
    return (
      <main className="flex min-h-screen w-full xl:w-[70%]    flex-col p-5  sm:p-10   lg:p-24">
        <h1 className="text-black font-bold text-left w-full mb-5">
          {pathname.split("/")[2] === "create"
            ? "Create a Post"
            : "Update a Post"}
        </h1>
        <div className="w-full h-[1px] bg-gray-500"></div>
        <div className="w-full shadow-xl  p-5">
          <DropDown
            selected={selected}
            setSelected={setSelected}
            people={people}
            name={selected?.name}
          />
  
          <div className=" mt-5 ">
            <input
              type="text"
              name={data.title}
              defaultValue={postData.title || ""}
              className="p-2 w-full border text-xs md:text-lg focus:outline-none  rounded-lg border-slate-500"
              placeholder="Гарчиг оруулах.. "
              onChange={(e) => setData({ ...data, title: e.target.value })}
              
            />
            <textarea
              id=""
              cols={50}
              rows={10}
              name={data.content}
              defaultValue={postData.content || ""}
              className="mt-5  w-full rounded-lg text-xs md:text-lg border border-slate-500 p-2  focus:outline-none mb-3"
              placeholder="Контент оруулах..."
              onChange={(e) => setData({ ...data, content: e.target.value })}
            ></textarea>
            <div className="flex gap-12 ">
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
  
                  setData({ ...data, image: res?.[0]?.fileUrl ?? "" });
                }}
                onUploadError={(error: Error) => {
                  alert(`ERROR! ${error.message}`);
                }}
              />
            </div>
            <p className="mt-3 font-extrabold text-slate-500 p-3"> -- OR -- </p>
            <div>
              <input
                type="text"
                placeholder="Add image link here..."
                className="mt-5 mb-6 w-full text-xs md:text-lg rounded-md p-2 bg-slate-200 "
                name={data.image}
                defaultValue={postData.image || ""}
                onChange={(e) => setData({ ...data, image: e.target.value })}
              />
            </div>
            <div className="flex w-full  justify-center">
              <button
                disabled={btn}
                type="button"
                onClick={pathname.split("/").pop() == "create" ? handleSubmit : handleUpdate}
                className={`${
                  data.image.length == 0 ? "cursor-progress" : ""
                }text-black bg-slate-300 hover:bg-slate-400 focus:outline-none  font-medium rounded-full text-xs md:text-sm  px-5 py-2.5 w-[50%]  md:w-[30%] `}
              >
                {loading ? (
                  <div className="flex items-center justify-center ">
                    <svg
                      aria-hidden="true"
                      role="status"
                      className="inline mr-3 w-4 h-4 text-white animate-spin"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="black"
                      ></path>
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                    <p>Uploading...</p>
                  </div>
                ) : pathname.split("/")[2] === "create" ? (
                  "Create"
                ) : (
                  "Update"
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }
}
