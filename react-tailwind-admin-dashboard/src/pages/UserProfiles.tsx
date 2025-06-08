import { useSelector } from "react-redux";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import AdminLayout from "../layout/AdminLayout";
import OwnerLayout from "../layout/OwnerLayout";

export default function UserProfiles() {
  const { user } = useSelector((state) => state.auth);

  let Layout =
    user.roles[0] === "ADMIN"
      ? AdminLayout
      : user.roles[0] === "owner"
      ? OwnerLayout
      : null;

  return (
    <>
      <Layout>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <div className="space-y-6">
            <UserInfoCard />
          </div>
        </div>
      </Layout>
    </>
  );
}
