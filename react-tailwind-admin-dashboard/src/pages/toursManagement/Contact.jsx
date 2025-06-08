import { useState, useEffect } from "react";

function Contact({ onContactInfosChange, initialData }) {
  const [data, setData] = useState({
    ste_name:"",
    email: "",
    address: "",
    tel: "",
  });

  useEffect(() => {
    if (initialData) {
      setData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
    onContactInfosChange({
      ...data,
      [name]: value,
    });
  };

  return (
    <form className="max-w-4xl mx-auto">
      {" "}
      {/* Increased max width and centered */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {" "}
        {/* 1 column on mobile, 2 on medium+ screens */}
        {/* Column 1 */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nom Société
            </label>
            <input
              type="text"
              name="ste_name"
              value={data.ste_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700/50 dark:text-white/90 dark:focus:ring-blue-500/50 transition-colors"
              placeholder="Societé XYZ"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Adresse
            </label>
            <input
              type="text"
              name="address"
              value={data.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700/50 dark:text-white/90 dark:focus:ring-blue-500/50 transition-colors"
              placeholder="123 Rue Exemple, Ville"
            />
          </div>
        </div>
        {/* Column 2 */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700/50 dark:text-white/90 dark:focus:ring-blue-500/50 transition-colors"
              placeholder="email@exemple.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Téléphone
            </label>
            <input
              type="tel"
              name="tel"
              value={data.tel}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700/50 dark:text-white/90 dark:focus:ring-blue-500/50 transition-colors"
              placeholder="+216 xx xxx xxx"
            />
          </div>
        </div>
      </div>
    </form>
  );
}

export default Contact;
