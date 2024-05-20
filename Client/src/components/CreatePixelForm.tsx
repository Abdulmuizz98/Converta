import { useState, FormEvent } from "react";
import { useAppDispatch } from "../store/hooks";
import { addPixel } from "../store/pixelsSlice";
import { revokeAccessToken } from "firebase/auth";

const CreatePixelForm = () => {
  const [pixelName, setPixelName] = useState("");
  const [pixelDescription, setPixelDescription] = useState("");
  const [pixelId, setPixelId] = useState("");
  const [pixelType, setPixelType] = useState("Ad");
  const [accessToken, setAccessToken] = useState("");
  const dispatch = useAppDispatch();
  console.log("Pixel type: ", pixelType);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(
      addPixel({ pixelName, pixelDescription, pixelId, pixelType, accessToken })
    );
  };

  console.log(pixelType);
  return (
    <div className="mb-[60px]">
      <h3 className="text-2xl dark:text-white">Add a New Pixel to Converta</h3>
      <form
        className="w-auto max-w-[500px] mx-auto lg:mx-0"
        onSubmit={handleSubmit}
      >
        <div className="m-5">
          <div className="flex justify-between items-center">
            <label
              htmlFor="pixel-name"
              className="block text-sm font-medium mb-2 dark:text-white"
            >
              Pixel Name
            </label>
            <span className="block text-sm text-gray-500 mb-2">
              Recommended
            </span>
          </div>
          <input
            type="text"
            id="pixel-name"
            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
            placeholder="Amazon pixel"
            onChange={(e) => setPixelName(e.target.value)}
            value={pixelName}
          ></input>
        </div>
        <div className="m-5">
          <div className="flex justify-between items-center">
            <label
              htmlFor="pixel-description"
              className="block text-sm font-medium mb-2 dark:text-white"
            >
              Description
            </label>
            <span className="block text-sm text-gray-500 mb-2">
              Recommended
            </span>
          </div>
          <input
            type="text"
            id="pixel-description"
            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
            placeholder="A short description of the pixel."
            onChange={(e) => setPixelDescription(e.target.value)}
            value={pixelDescription}
          ></input>
        </div>
        <div className="m-5">
          <div className="flex justify-between items-center">
            <label
              htmlFor="pixel-id"
              className="block text-sm font-medium mb-2 dark:text-white"
            >
              Pixel ID
            </label>
            <span className="block text-sm text-gray-500 mb-2">Required</span>
          </div>
          <input
            type="text"
            id="pixel-id"
            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
            placeholder="1224i382920433234"
            onChange={(e) => setPixelId(e.target.value)}
            value={pixelId}
          ></input>
        </div>
        <div className="m-5">
          <div className="flex justify-between items-center">
            <label
              htmlFor="access-token"
              className="block text-sm font-medium mb-2 dark:text-white"
            >
              Meta Access Token
            </label>
            <span className="block text-sm text-gray-500 mb-2">Required</span>
          </div>
          <input
            type="text"
            id="access-token"
            onChange={(e) => setAccessToken(e.target.value)}
            value={accessToken}
            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
          ></input>
        </div>
        <div className="m-5">
          <label
            htmlFor="pixel-type"
            className="block text-sm font-medium mb-2 dark:text-white"
          >
            Pixel Type
          </label>
          <select
            id="pixel-type"
            onChange={(e) => setPixelType(e.target.value)}
            value={pixelType}
            className="py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
          >
            <option disabled>Open this select menu</option>
            <option>Ad</option>
            <option>Campaign</option>
          </select>
        </div>

        <button
          type="submit"
          className="my-5 w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
        >
          Add Pixel
        </button>
      </form>
    </div>
  );
};

export default CreatePixelForm;
