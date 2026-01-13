"use client"
import { InputSelect } from "@/components/ui/form/InputSelect"
import { InputText } from "@/components/ui/form/InputText"
import { IUser, UserRole } from "@/lib/definitions"
import { useState } from "react"

export default function ProfilePage() {
  const [profile, setProfile] = useState<Partial<IUser>>({
    name: "",
    username: "",
    password: "",
    phoneNumber: "",
    email: "",
    userRole: "technician",
  })

  
  return (
    <div className="bg-white w-full min-h-96 p-4">
      <div className="flex justify-between">
        <div className="mb-8 flex items-center gap-2">
          <svg
            className="fill-gray-500 group-hover:fill-gray-700 dark:fill-gray-400 dark:group-hover:fill-gray-300"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 14.1526 4.3002 16.1184 5.61936 17.616C6.17279 15.3096 8.24852 13.5955 10.7246 13.5955H13.2746C15.7509 13.5955 17.8268 15.31 18.38 17.6167C19.6996 16.119 20.5 14.153 20.5 12C20.5 7.30558 16.6944 3.5 12 3.5ZM17.0246 18.8566V18.8455C17.0246 16.7744 15.3457 15.0955 13.2746 15.0955H10.7246C8.65354 15.0955 6.97461 16.7744 6.97461 18.8455V18.856C8.38223 19.8895 10.1198 20.5 12 20.5C13.8798 20.5 15.6171 19.8898 17.0246 18.8566ZM2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM11.9991 7.25C10.8847 7.25 9.98126 8.15342 9.98126 9.26784C9.98126 10.3823 10.8847 11.2857 11.9991 11.2857C13.1135 11.2857 14.0169 10.3823 14.0169 9.26784C14.0169 8.15342 13.1135 7.25 11.9991 7.25ZM8.48126 9.26784C8.48126 7.32499 10.0563 5.75 11.9991 5.75C13.9419 5.75 15.5169 7.32499 15.5169 9.26784C15.5169 11.2107 13.9419 12.7857 11.9991 12.7857C10.0563 12.7857 8.48126 11.2107 8.48126 9.26784Z"
              fill=""
            />
          </svg>
          <div>
            {/* <h1 className="">Username</h1>
            <p className="font-light text-slate-500">email</p> */}
            <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
              username
            </span>
            <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
              email
            </span>
          </div>
        </div>
        <div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
            Save
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <InputText
          className="w-full"
          label="Username"
          type="text"
          value={profile.username}
          onChange={(e) => setProfile({ ...profile, username: e.target.value } as IUser)}
        />

        <InputText
          className="w-full"
          label="Name"
          type="text"
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value } as IUser)}
        />

        <InputText
          label="Password"
          type="password"
          onChange={(e) => setProfile({ ...profile, password: e.target.value } as IUser)}
        />

        <InputText
          label="Phone Number"
          value={profile.phoneNumber || ""}
          onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value } as IUser)}
        />

        <InputText
          label="Email"
          type="email"
          value={profile.email || ""}
          onChange={(e) => setProfile({ ...profile, email: e.target.value } as IUser)}
        />

        {/* create input file profile.image  */}

    



        <InputSelect
          label="Role"
          value={profile.userRole || "technician"}
          disabled={true}
          onChange={(e) =>
            setProfile({
              ...profile,
              userRole: e.target.value as UserRole,
            } as IUser)
          }
          options={[
            { label: "Technician", value: "technician" },
            { label: "Manager", value: "manager" },
            { label: "Admin", value: "admin" },
            { label: "Warehouse", value: "warehouse" },
            { label: "Finishing", value: "finishing" },
            { label: "Helper", value: "helper" },
          ]}
        />
      </div>
    </div>
  )
}
