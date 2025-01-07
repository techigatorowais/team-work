import { postData } from "./api";

export const CalculateInitials = (name) => {
  const nameParts = name?.split(" ");
  const firstInitial = nameParts && nameParts[0].charAt(0).toUpperCase();
  const lastInitial =
    nameParts && nameParts.length > 1
      ? nameParts[1].charAt(0).toUpperCase()
      : "";
  return firstInitial + lastInitial;
};

export const GetDefaultColor = (color) => {
  return color || "bg-orange-500";
};

export const maskEmail = (email) => {
  const [localPart, domain] = email?.split("@");
  return `${localPart[0]}*****@${domain}`;
};

export const maskPhone = (phone) => {
  return phone.slice(0, 3) + "*****" + phone.slice(-3);
};

export const AddTaskActivity = async (onSuccess, activityData) => {
  try {
    const { data } = await postData(`api/tasks/activity/add`, activityData);
    if (data.success == true) {
      onSuccess();
    }
    return data["response"];
  } catch (err) {
    console.log("err---> ", err);
    return null;
  }
};

export const FormatDate = (date) => {
  const newDate = new Date(date);
  return newDate.toISOString();
};
