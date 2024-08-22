import Sidebar from "../layout/SideBar";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { createNewApiKey } from "../../store/apiKeysSlice";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const convertaApiKey = useAppSelector(
    (state) => state.apiKeys.keys?.converta ?? null
  );

  console.log("converta key: ", convertaApiKey);

  const handleGetOrUpdateApiKey = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    dispatch(createNewApiKey("converta"));
  };

  return (
    <div className="mx-[20px] md:mx-[100px] lg:ml-[350px] pt-[70px] lg:pt-[100px] min-h-screen">
      <Sidebar />
      <div className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-slate-900 dark:border-gray-700 dark:shadow-slate-700/[.7]">
        <div className="p-4 md:p-10">
          <h3 className="text-2xl dark:text-white mb-5">Credentials:</h3>
          <p className="mb-5 text-sm text-gray-600 dark:text-gray-400">
            {convertaApiKey ? (
              <>
                <span className="font-bold mr-10">Apikey: </span>
                {convertaApiKey}
              </>
            ) : (
              <>"You don't have an apikey yet."</>
            )}
          </p>
          <button
            onClick={handleGetOrUpdateApiKey}
            className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-gray-200 text-gray-500 hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:border-gray-700 dark:text-gray-400 dark:hover:text-blue-500 dark:hover:border-blue-600 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
          >
            {convertaApiKey ? "Get New apiKey" : "Get An apiKey"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
