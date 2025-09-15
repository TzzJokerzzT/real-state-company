import type { Pagination } from "@/store/types";
import { Home, Search, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ButtonComponent } from "../Button/Button";

export const Header = ({ pagination }: { pagination: Pagination }) => {
  const navigate = useNavigate();
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center hover:cursor-pointer">
            <Home className="w-8 h-8 text-blue-600 mr-3" />
            <h1
              className="text-2xl font-bold text-gray-900"
              onClick={() => navigate("/")}
            >
              Real Estate Properties
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center text-sm text-gray-500">
              <Search className="w-4 h-4 mr-2" />
              {pagination.totalCount} properties found
            </div>
            <ButtonComponent
              onClick={() => navigate("/register-property")}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Property
            </ButtonComponent>
          </div>
        </div>
      </div>
    </header>
  );
};
