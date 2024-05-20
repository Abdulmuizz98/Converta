import { FC, useEffect } from "react";
import CreatePixelForm from "../CreatePixelForm";
import SideBar from "../../components/layout/SideBar";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getPixels } from "../../store/pixelsSlice";

import Card from "../Card";

// const pixels = [
//   { name: "Pixel 1", pixelId: "123456" },
//   { name: "Pixel 2", pixelId: "123456" },
//   { name: "Pixel 3", pixelId: "123456" },
//   { name: "Pixel 1", pixelId: "123456" },
//   { name: "Pixel 2", pixelId: "123456" },
//   { name: "Pixel 3", pixelId: "123456" },
// ];

const platforms = {
  meta: "Meta",
  google: "Google",
  pinterest: "Pinterest",
};

const isPlatform = (platform: string) => platform.toLowerCase() in platforms;

const Platform: FC = () => {
  const platform = useParams().platform?.toLowerCase();
  const dispatch = useAppDispatch();
  const pixels = useAppSelector((state) => state.pixels.pixels);

  useEffect(() => {
    dispatch(getPixels());
  }, [dispatch]);

  return (
    <div className="mx-[20px] md:mx-[100px] lg:ml-[350px] pt-[70px] lg:pt-[100px] min-h-screen">
      <SideBar />
      {platform && isPlatform(platform) ? (
        <>
          <div>
            <h2 className="text-3xl dark:text-white mb-10">
              {platform.charAt(0).toUpperCase() + platform.substring(1)}{" "}
              Platform
            </h2>
            <CreatePixelForm />
          </div>

          <div>
            <h3 className="text-2xl dark:text-white mb-10">
              My {platform} Pixels
            </h3>

            <div className="p-[20px] grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-10 items-center justify-center">
              {pixels.map((pixel, index) => (
                <Card
                  key={index}
                  name={pixel.name}
                  pixelId={pixel.id}
                  href={`/pixel/${platform}/${pixel.id}`}
                />
              ))}
            </div>
          </div>
        </>
      ) : (
        <>Not Found</>
      )}
    </div>
  );
};

export default Platform;
