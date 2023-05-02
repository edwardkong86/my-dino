import Image from "next/image";
import { Inter } from "next/font/google";
import { FormBuilderV4 as DynamoEngine, useHistory } from "dynamo";
import _ from "lodash";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { renderComponent, validationResolver } from "@/components";
import axios from "axios";

import { Space } from "antd";
const inter = Inter({ subsets: ["latin"] });

export default function Dynamo() {
  const dynamoRef = useRef(null);

  const [loading, setLoading] = useState(false);
  // const [currentJson, setCurrentJson] = useState(null);
  const [dataStore, setDataStore] = useState(null);
  // const [defaultValues, setDefaultValues] = useState(null);
  const {
    state,
    setState,
    resetState,
    index,
    currentPage,
    goBack,
    goForward,
    updatePage,
    history,
  } = useHistory({});

  useEffect(() => {
    console.log("useEffect");
    // Direct
    fetchDynamoJson(
      "https://dynamobff.maybanksandbox.com/forms/645127be013c34001c183d76"
    );
  }, []);

  const fetchDynamoJson = useCallback(
    (uri, params = null) => {
      axios
        .get(uri)
        .then((response) => {
          console.log("fetchDynamoJson-response", response);
          jsonDataBinding(response, params);
          setLoading(false);
        })
        .catch((err) => setLoading(false));
    },
    []
  );

  const jsonDataBinding = useCallback(
    (response, params = null) => {
      let updatedResult = response?.data?.data ?? response.data;
      const {
        dataHelper = {},
        dataModel = {},
        defaultValues = {},
      } = updatedResult;

      if (dataHelper && dataModel) {
        for (const [key, value] of Object.entries(dataModel)) {
          updatedResult = _.set(updatedResult, `items.${key}`, value);
        }
      }

      for (const [key, value] of Object.entries(updatedResult.items)) {
        const itemDefaultValue = _.get(value, "defaultValue");
        if (itemDefaultValue) {
          _.set(updatedResult, `defaultValues.${value.name}`, itemDefaultValue);
        }
      }

      setDataStore({ ...dataStore, ...params });
      setState(updatedResult);
    },
    [dataStore, setState]
  );

  const managedCallback = async ({ item, data = null, validate = false }) => {
    if (validate) {
        const formData = await dynamoRef.current.getValues();
        if (formData === false) return false;
    }

    // If has action
    if (item?.action && item?.action?.actionType !== "") {
        return localFunction[item.action.actionType]({ item, data, form: dynamoRef.current });
    }

    return true;
};

const Equal = (key, value) => (values) => {
  console.log("EqualEqual", key, value, values, _.get(values, key))
  if (!values) return false;
  const selectedValue = _.get(values, key) || null;
  return selectedValue === value;
};

const localFunction = {
  // callService: async ({ item, data, form }) => {
  //     const { action } = item;
  //     const { actionURL = "" } = action;
  //     if (actionURL?.length > 0) {
  //         Services[actionURL] &&
  //             Services[actionURL]()
  //                 .then((response) => {
  //                     // console.log("callServicecallService", response);
  //                     if (response != null) {
  //                         let result = item?.dataSchema
  //                             ? _.get(response, `${item.dataSchema}`)
  //                             : response.data;

  //                         if (item?.dataTemplate) {
  //                             result = _.map(result, function (resultItem) {
  //                                 return {
  //                                     ...resultItem,
  //                                     dataTemplate: item?.dataTemplate,
  //                                 };
  //                             });
  //                         }

  //                         if (item?.dataSortBy) {
  //                             result = _.sortBy(result, item.dataSortBy);
  //                         }

  //                         // setDataStore(tempDataStore);
  //                         if (item?.dataStore) {
  //                             form.setValue(item.dataStore, result);
  //                         } else {
  //                             setDataStore({ ...dataStore, [actionURL]: result });
  //                         }
  //                     }
  //                 })
  //                 .catch(() => {});
  //     }
  // },
  // callServiceSaveDataSource: async ({ item, data, form }) => {
  //     const { action } = item;
  //     const { actionURL = "" } = action;
  //     if (actionURL?.length > 0) {
  //         console.log(
  //             "callServiceToDataSourcecallServiceToDataSource",
  //             actionURL,
  //             Services[actionURL]
  //         );
  //         return new Promise((resolve, reject) => {
  //             Services[actionURL]()
  //                 .then((response) => {
  //                     if (item?.extra?.dataSchema) {
  //                         setDataStore({
  //                             ...dataStore,
  //                             [item.extra.dataStore]: _.get(
  //                                 response,
  //                                 `data.${item.extra.dataSchema}`
  //                             ),
  //                         });
  //                     } else {
  //                         setDataStore({ ...dataStore, [item.name]: response });
  //                     }

  //                     resolve(response);
  //                 })
  //                 .catch((error) => {
  //                     reject(error);
  //                 });
  //         });
  //     }
  // },
  // callbackService: async ({ item, data, form }) => {
  //     const { action } = item;
  //     const { actionURL = "" } = action;
  //     if (item?.action?.actionURL?.length > 0) {
  //         console.log("callbackServicecallbackService", actionURL, Services[actionURL]);
  //         return new Promise((resolve, reject) => {
  //             Services[actionURL]()
  //                 .then((respone) => {
  //                     resolve(respone);
  //                 })
  //                 .catch((error) => {
  //                     reject(error);
  //                 });
  //         });
  //     }
  // },
  navigateTo: async ({ item, data }) => {
      const { action } = item;
      const { actionType = "", actionURL = "", dataStore = "" } = action;
      console.log("actionaction", action, data);
      if (isURL(actionURL)) {
          if (dataStore) {
              fetchDynamoJson(actionURL, { [dataStore]: data });
          } else {
              fetchDynamoJson(actionURL, data);
          }
      }
  },
  navigateBack: async ({ item, data }) => {
      navigation.goBack();
      //goBack();
  },
  Equal,
};


  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-start p-24 ${inter.className}`}
    >
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Get started by editing&nbsp;
          <code className="font-mono font-bold">src/pages/dynamo/index.js</code>
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://github.com/yaser2us/dynamo"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={`mb-3 text-2xl font-semibold`}>by Dynamo</h2>
          </a>
        </div>
      </div>
      <div className="flex  w-full max-w-5xl flex-col mt-5">
        <DynamoEngine
          ref={dynamoRef}
          key={`dynamo-${state?._id}`}
          name={`dynamo-${state?._id}`}
          items={state?.items}
          defaultValues={state?.defaultValues ?? {}}
          components={renderComponent}
          managedCallback={managedCallback}
          validationResolver={validationResolver}
          dataStore={dataStore}
          localFunction={localFunction}
          devMode={false}
        />
      </div>

      {/* <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700/10 after:dark:from-sky-900 after:dark:via-[#0141ff]/40 before:lg:h-[360px]">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>

      <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-4 lg:text-left">
        <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Docs{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Find in-depth information about Next.js features and API.
          </p>
        </a>

        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Learn{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Learn about Next.js in an interactive course with&nbsp;quizzes!
          </p>
        </a>

        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Templates{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Discover and deploy boilerplate example Next.js&nbsp;projects.
          </p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Deploy{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Instantly deploy your Next.js site to a shareable URL with Vercel.
          </p>
        </a>
      </div> */}
    </main>
  );
}
