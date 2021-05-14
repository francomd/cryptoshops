import { useEffect, useRef } from "react";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";

const WrapperStyle = "relative m-2";
const InputStyle = "w-full py-2 px-4 h-12 rounded-3xl outline-none focus:shadow-md";
const ListWrapperStyle =
  "absolute top-14 h-24 w-full bg-white rounded-lg overflow-hidden shadow-xl z-50";
const ListStyle = "h-full overflow-y-auto py-2";
const ItemStyle = "py-2 px-3 m-0 text-left";

interface IPlacesAutocomplete {
  onSelect?: (string) => void;
  defaultAddress?: string;
}

const PlacesAutocomplete = ({
  onSelect,
  defaultAddress,
}: IPlacesAutocomplete): React.ReactElement => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: {
        country: "ar",
      },
    },
    debounce: 300,
  });

  const inputRef = useRef();

  const wrapperRef = useOnclickOutside(() => {
    // When user clicks outside of the component, we can dismiss
    // the searched suggestions by calling this method
    clearSuggestions();
  });

  useEffect(() => {
    if (defaultAddress) setValue(defaultAddress);
  }, [defaultAddress]);

  useEffect(() => {
    setTimeout(() => {
      if (document.activeElement !== inputRef.current) clearSuggestions();
    }, 300);
  }, []);

  const handleInput = (e) => {
    // Update the keyword of the input element
    setValue(e.target.value);
  };

  const handleSelect =
    ({ description }) =>
    () => {
      // When user selects a place, we can replace the keyword without request data from API
      // by setting the second parameter to "false"
      setValue(description, false);
      clearSuggestions();

      // Get latitude and longitude via utility functions
      getGeocode({ address: description })
        .then((results) => getLatLng(results[0]))
        .then((latLng) => {
          onSelect({
            address: description,
            latLng: {
              ...latLng,
            },
          });
        })
        .catch((error) => {
          console.log("😱 Error: ", error);
        });
    };

  const renderSuggestions = () =>
    data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion;

      return (
        <div
          key={place_id}
          onClick={handleSelect(suggestion)}
          onKeyDown={handleSelect(suggestion)}
          className={ItemStyle}
          role="button"
          tabIndex={0}
        >
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </div>
      );
    });

  return (
    <div className={WrapperStyle} ref={wrapperRef}>
      <input
        ref={inputRef}
        value={value}
        onChange={handleInput}
        disabled={!ready}
        placeholder="Ingresar direccion"
        className={InputStyle}
      />
      {status === "OK" && (
        <div className={ListWrapperStyle}>
          <div className={ListStyle}>{renderSuggestions()}</div>
        </div>
      )}
    </div>
  );
};

export default PlacesAutocomplete;