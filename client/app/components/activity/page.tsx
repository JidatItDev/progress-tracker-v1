export interface ActivityProps {
  id: number;
  heading: string;
  projectName: string;
  updatedby: string;
  time: string;
}

interface ActivityComponentProps {
  activity: ActivityProps;
}

const Activity = ({ activity }: ActivityComponentProps) => {
  const initials = activity.updatedby
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex items-start gap-2 p-3 px-5  ">
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-800 text-sm font-semibold text-white">
        {initials}
      </div>

      <div>
        <h1 className="text-base whitespace-nowrap font-light text-gray-900">
          {activity.heading}
        </h1>

        <p className="text-xs text-gray-500">
          Project: <span className="font-medium">{activity.projectName}</span>
        </p>

        <p className="text-xs text-gray-500">
          {activity.updatedby} • {activity.time}
        </p>
      </div>
    </div>
  );
};

export default Activity;
