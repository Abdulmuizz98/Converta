import SideBar from "../../components/layout/SideBar";
import { useParams } from "react-router-dom";
import EventCard from "../EventCard";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { notify, ERROR } from "../../store/notificationSlice";
import { getConfig, logout } from "../../store/authSlice";
import { getPixels } from "../../store/pixelsSlice";
import { Event } from "../../types";

// const pixel = {
//   name: "Amazon Pixel",
//   pixelId: "123456",
//   description: "A short description of the pixel.",
//   href: "https://www.google.com",
//   accessToken: "ajdf03eq39e2-03092423904u234891209431-423i1049340129842309412",
// };

// const Events = [
//   {
//     name: "fakdjfalskfsafl",
//     time: 17278287278,
//   },
//   {
//     name: "fakdjfalskfsafl",
//     time: 17278287278,
//   },
//   {
//     name: "fakdjfalskfsafl",
//     time: 17278287278,
//   },
// ];

const Pixel = () => {
  const { platform, pixelId } = useParams();
  console.log(useParams());
  console.log(pixelId);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user!);
  const token = user.token;
  const [events, setEvents] = useState<Event[]>([]);
  const pixels = useAppSelector((state) => state.pixels.pixels);
  const pixel = pixels.find((p) => p.id === pixelId) || {
    id: "unknown",
    name: "Unknown",
    pixel_type: "Unknown",
    user_id: "Unknown",
    description: "Unknown",
    access_token: "Unknown",
  };
  const SERVICE_URI = import.meta.env.VITE_SERVICE_URI;

  // interface Pixel {
  //   id: string;
  //   name: string;
  //   pixel_type: string;
  //   user_id: string;
  // }

  console.log("metaEvents: ", events);

  useEffect(() => {
    dispatch(getPixels());
  }, [dispatch]);

  useEffect(() => {
    async function fetchEvents() {
      const url = `${SERVICE_URI}/api/pixel/${pixelId}/metaEvents`;

      try {
        const res = await fetch(url, getConfig(token));
        const data = await res.json();
        setEvents(data);
      } catch (err: any) {
        if (err.response.status === 403) {
          dispatch(logout());
        }
        const payload = {
          msg: err.message,
          status: err.response.status,
          type: ERROR,
        };
        dispatch(notify(payload));
      }
    }
    fetchEvents();
  }, [dispatch, token, pixelId]);

  return (
    <div className="mx-[20px] md:mx-[100px] lg:ml-[350px] pt-[70px] lg:pt-[100px] min-h-screen pb-52">
      <SideBar />
      <div>
        <h2 className="text-3xl dark:text-white my-10 inline-flex items-center gap-x-5">
          {pixel.name}
          <span className=" py-1.5 px-3 rounded-lg text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-500">
            {platform} pixel
          </span>
        </h2>
      </div>

      <div className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-slate-900 dark:border-gray-700 dark:shadow-slate-700/[.7]">
        <div className="p-4 md:p-10">
          <h3 className="text-2xl dark:text-white mb-5">Details:</h3>
          <p className="mb-5 text-sm text-gray-600 dark:text-gray-400">
            {pixel.description}
          </p>
          <ul
            role="list"
            className="marker:text-blue-600 list-disc ps-5 space-y-2 text-sm text-gray-600 dark:text-gray-400"
          >
            <li>PIXEL ID: {pixel.id}</li>
            <li>
              <p className="break-words">ACCESS TOKEN: {pixel.access_token}</p>
            </li>
            <li>
              <p>PIXEL TYPE: {pixel.pixel_type}</p>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-[40px]">
        <h3 className="text-2xl dark:text-white mb-10">Pixel Events</h3>
        <div className="hs-accordion-group">
          {events.map((e, index) => (
            <EventCard key={index} {...e} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pixel;
