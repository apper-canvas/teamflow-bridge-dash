import React, { useContext } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import { AuthContext } from "../../App";

const LogoutButton = () => {
  const { logout } = useContext(AuthContext);
  
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={logout}
      className="text-red-600 border-red-300 hover:bg-red-50"
    >
      <ApperIcon name="LogOut" className="w-4 h-4 mr-1" />
      Logout
    </Button>
  );
};
const Header = ({ 
  title,
  onMenuClick,
  onSearch,
  showSearch = false,
  actions,
  className 
}) => {
  return (
    <header className={cn(
      "bg-white border-b border-secondary-200 px-6 py-4",
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <ApperIcon name="Menu" className="h-6 w-6" />
          </Button>

          <div>
            <h1 className="text-2xl font-bold text-secondary-900">{title}</h1>
          </div>
        </div>

<div className="flex items-center space-x-4">
          {showSearch && (
            <div className="hidden md:block">
              <SearchBar
                placeholder="Search employees..."
                onSearch={onSearch}
                className="w-64"
              />
            </div>
          )}

          {actions && (
            <div className="flex items-center space-x-2">
              {actions}
            </div>
          )}
          
          <LogoutButton />
        </div>
      </div>
    </header>
  );
};

export default Header;