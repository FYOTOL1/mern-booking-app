import { useFormContext } from "react-hook-form";
import { HotelFormData } from "./ManageHotelForm";

const HotelDetailsSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelFormData>();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold mb-3">Add Hotel</h1>
      <label className="text-gray-700 text-xm font-bold flex-1">
        Name
        <input
          autoComplete="off"
          className="border border-gray-300 rounded w-full py-1 px-2 font-normal"
          {...register("name", { required: "This Field Is Required" })}
          type="text"
        />
        {errors.name && (
          <span className="text-red-500">{errors.name.message}</span>
        )}
      </label>
      <div className="flex gap-4">
        <label className="text-gray-700 text-xm font-bold flex-1">
          City
          <input
            autoComplete="off"
            className="border border-gray-300 rounded w-full py-1 px-2 font-normal"
            {...register("city", { required: "This Field Is Required" })}
            type="text"
          />
          {errors.city && (
            <span className="text-red-500">{errors.city.message}</span>
          )}
        </label>{" "}
        <label className="text-gray-700 text-xm font-bold flex-1">
          Country
          <input
            autoComplete="off"
            className="border border-gray-300 rounded w-full py-1 px-2 font-normal"
            {...register("country", { required: "This Field Is Required" })}
            type="text"
          />
          {errors.country && (
            <span className="text-red-500">{errors.country.message}</span>
          )}
        </label>
      </div>
      <label className="text-gray-700 text-xm font-bold flex-1">
        Description
        <textarea
          autoComplete="off"
          className="border border-gray-300 rounded w-full py-1 px-2 font-normal"
          {...register("description", { required: "This Field Is Required" })}
          rows={10}
        ></textarea>
        {errors.description && (
          <span className="text-red-500">{errors.description.message}</span>
        )}
      </label>
      <label className="text-gray-700 text-xm font-bold max-w-[50%]">
        Price Per Night
        <input
          className="border border-gray-300 rounded w-full py-1 px-2 font-normal"
          {...register("pricePerNight", { required: "This Field Is Required" })}
          type="number"
          autoComplete="off"
        />
        {errors.pricePerNight && (
          <span className="text-red-500">{errors.pricePerNight.message}</span>
        )}
      </label>
      <label className="text-gray-700 text-xm font-bold max-w-[50%]">
        Star Rating
        <select
          {...register("starRating", {
            required: "This Field Is Required",
          })}
          className="border rounded w-full p-2 text-gray-700 font-normal"
        >
          <option value="" className="text-sm font-bold">
            Select as Rating
          </option>
          {[1, 2, 3, 4, 5].map((e) => (
            <option value={e}>{e}</option>
          ))}
        </select>
        {errors.starRating && (
          <span className="text-red-500">{errors.starRating.message}</span>
        )}
      </label>
    </div>
  );
};

export default HotelDetailsSection;
