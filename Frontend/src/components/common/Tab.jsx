function Tab({ tabData, field, setField }) {
  return (
    <div className="my-6 flex rounded-full bg-richblack-800 p-1 max-w-max gap-x-1">
      {tabData?.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => setField(tab.type)}
          className={`${
            field === tab.type
              ? "bg-richblack-900 text-richblack-5"
              : "bg-transparent text-richblack-200"
          } rounded-full px-5 py-2 text-sm font-medium transition-all duration-200`}
        >
          {tab.tabName}
        </button>
      ))}
    </div>
  );
}

export default Tab;
