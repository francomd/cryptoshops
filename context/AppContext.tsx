import axios from "axios";
import { createContext, Dispatch, SetStateAction, useEffect, useState } from "react";
import { TLocation } from "../types";

export interface ILocation extends TLocation {
  setLocation: Dispatch<SetStateAction<ILocation>>;
}

export interface ICategories {
  list: string[];
  selected: string;
  setCategories: Dispatch<SetStateAction<ICategories>>;
}

export interface IAppContext {
  location: ILocation;
  categories: ICategories;
}

const AppContext = createContext<IAppContext>(null);

export default AppContext;

export const useInitializeContextHook = (
  defaultLocation: Omit<ILocation, "setLocation">,
  defaultCategories: Omit<ICategories, "setCategories">
): { location: ILocation; categories: ICategories } => {
  const [location, setLocation] = useState<ILocation>(null);
  const [categories, setCategories] = useState<ICategories>(null);

  useEffect(() => {
    const localStorageLocation = JSON.parse(localStorage.getItem("location"));

    if (localStorageLocation) {
      setLocation({
        address: localStorageLocation.address,
        latLng: {
          lat: localStorageLocation.latLng.lat,
          lng: localStorageLocation.latLng.lng,
        },
        setLocation: setLocation,
      });
    } else {
      setLocation({
        ...defaultLocation,
        setLocation: setLocation,
      });
    }

    setCategories({
      ...defaultCategories,
      setCategories: setCategories,
    });

    const fetchData = async (): Promise<void> => {
      const result = await axios.get("/api/categories");
      setCategories({
        list: result.data.list,
        setCategories: setCategories,
        selected: "",
      });
    };

    fetchData();
  }, []);

  return { location, categories };
};
