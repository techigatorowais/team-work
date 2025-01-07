import DashboardLayout from "./(dashboard)/layout";
import Project from "./(dashboard)/project/page";


const Homepage = () => {

  return (
    <div className="">
      <DashboardLayout>
        <Project />
      </DashboardLayout>
    </div>
  );
};

export default Homepage;
