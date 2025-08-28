import React, { useState } from "react";
import {
  FaCalendarAlt,
  FaShoppingBag,
  FaCheckCircle,
  FaClock,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaCut,
  FaUserTie,
  FaTape,
  FaEdit,
  FaEye,
  FaBell,
  FaSearch,
  FaFilter,
  FaPlus,
} from "react-icons/fa";
import { useSelector } from "react-redux";

const Dashboard = () => {
 

    const { user } = useSelector((store) => store.auth);

  // Statistics data for tailor management
  const statsData = [
    {
      title: "Total Bookings",
      value: "156",
      icon: <FaCalendarAlt className="text-2xl" />,
      color: "bg-blue-500",
      change: "+15%",
      changeColor: "text-green-500",
    },
    {
      title: "Total Orders",
      value: "289",
      icon: <FaShoppingBag className="text-2xl" />,
      color: "bg-purple-500",
      change: "+23%",
      changeColor: "text-green-500",
    },
    {
      title: "Orders Delivered",
      value: "243",
      icon: <FaCheckCircle className="text-2xl" />,
      color: "bg-green-500",
      change: "+18%",
      changeColor: "text-green-500",
    },
    {
      title: "Pending Orders",
      value: "46",
      icon: <FaClock className="text-2xl" />,
      color: "bg-orange-500",
      change: "-5%",
      changeColor: "text-red-500",
    },
  ];

  // Latest bookings data
  const latestBookings = [
    {
      id: "BK001",
      customerName: "Priya Sharma",
      phone: "+91 98765 43210",
      service: "Wedding Lehenga",
      bookingDate: "2024-06-11",
      appointmentDate: "2024-06-15",
      status: "Confirmed",
      statusColor: "green",
      amount: "₹15,000",
    },
    {
      id: "BK002",
      customerName: "Amit Patel",
      phone: "+91 87654 32109",
      service: "Business Suit",
      bookingDate: "2024-06-10",
      appointmentDate: "2024-06-14",
      status: "Pending",
      statusColor: "yellow",
      amount: "₹8,500",
    },
    {
      id: "BK003",
      customerName: "Sneha Reddy",
      phone: "+91 76543 21098",
      service: "Saree Blouse",
      bookingDate: "2024-06-09",
      appointmentDate: "2024-06-13",
      status: "Confirmed",
      statusColor: "green",
      amount: "₹2,800",
    },
    {
      id: "BK004",
      customerName: "Rohit Singh",
      phone: "+91 65432 10987",
      service: "Sherwani",
      bookingDate: "2024-06-08",
      appointmentDate: "2024-06-12",
      status: "Rescheduled",
      statusColor: "red",
      amount: "₹12,000",
    },
  ];

  // Latest employees added
  const latestEmployees = [
    {
      id: "EMP001",
      name: "Kavita Devi",
      position: "Senior Tailor",
      phone: "+91 98765 12345",
      joinDate: "2024-06-05",
      specialization: "Bridal Wear",
      experience: "8 years",
      salary: "₹25,000",
    },
    {
      id: "EMP002",
      name: "Suresh Kumar",
      position: "Junior Tailor",
      phone: "+91 87654 23456",
      joinDate: "2024-06-01",
      specialization: "Men's Formal",
      experience: "3 years",
      salary: "₹15,000",
    },
    {
      id: "EMP003",
      name: "Meera Joshi",
      position: "Designer",
      phone: "+91 76543 34567",
      joinDate: "2024-05-28",
      specialization: "Traditional Wear",
      experience: "5 years",
      salary: "₹20,000",
    },
  ];

  // Latest completed orders
  const completedOrders = [
    {
      id: "ORD001",
      customerName: "Anjali Gupta",
      item: "Wedding Saree Blouse",
      completedDate: "2024-06-11",
      orderDate: "2024-05-20",
      amount: "₹4,500",
      tailor: "Kavita Devi",
      rating: 5,
      paymentStatus: "Paid",
    },
    {
      id: "ORD002",
      customerName: "Vikram Mehta",
      item: "3-Piece Suit",
      completedDate: "2024-06-10",
      orderDate: "2024-05-15",
      amount: "₹12,000",
      tailor: "Suresh Kumar",
      rating: 4,
      paymentStatus: "Paid",
    },
    {
      id: "ORD003",
      customerName: "Deepika Rao",
      item: "Anarkali Dress",
      completedDate: "2024-06-09",
      orderDate: "2024-05-25",
      amount: "₹6,800",
      tailor: "Meera Joshi",
      rating: 5,
      paymentStatus: "Paid",
    },
    {
      id: "ORD004",
      customerName: "Arjun Nair",
      item: "Kurta Pajama Set",
      completedDate: "2024-06-08",
      orderDate: "2024-05-30",
      amount: "₹3,200",
      tailor: "Kavita Devi",
      rating: 4,
      paymentStatus: "Pending",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <main className="container mx-auto md:px-4 ">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">
                  Welcome back, {user?.name || "User"}!
                </h2>
                <p className="text-orange-100 mt-1 text-sm md:text-base">
                  Ready to create beautiful garments today?
                </p>
                <div className="mt-4 text-sm text-orange-100">
                  Today:{" "}
                  {new Date().toLocaleDateString("en-IN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
              <div className="text-right">
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold mb-2">
                
                   <img
           src={user?.photoUrl} alt={user?.name} 
              className="w-20 h-20   object-cover rounded-full"
            />
                </div>
                <p className="text-sm text-orange-100">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <a
            href="/admin/create-customer"
            className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <FaPlus className="mr-2" />
            Add Customer
          </a>
          <a href="/admin/create-item" className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            <FaShoppingBag className="mr-2" />
            Add New item
          </a>
            <a href="/admin/create-master" className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
            <FaShoppingBag className="mr-2" />
            Add Master
          </a>
             <a href="/admin/create-item" className="flex items-center px-4 py-2 bg-orange-700 text-white rounded-lg hover:bg-orange-800 transition-colors">
            <FaShoppingBag className="mr-2" />
            Add Salesman
          </a>
          <button className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            <FaUserTie className="mr-2" />
            Add Employee
          </button>
        </div>

        {/* Tables Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          {/* Latest Bookings */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-blue-50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <FaCalendarAlt className="mr-2 text-blue-600" />
                  Latest Bookings
                </h3>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View All
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {latestBookings.map((booking) => (
                    <BookingRow key={booking.id} {...booking} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Latest Employees */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-green-50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <FaUserTie className="mr-2 text-green-600" />
                  Latest Employees Added
                </h3>
                <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                  View All
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                      Specialization
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                      Join Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {latestEmployees.map((employee) => (
                    <EmployeeRow key={employee.id} {...employee} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Completed Orders */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200 bg-purple-50">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <FaCheckCircle className="mr-2 text-purple-600" />
                Latest Completed Orders
              </h3>
              <div className="flex items-center space-x-2">
                <button className="flex items-center px-3 py-1 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                  <FaFilter className="mr-1" />
                  Filter
                </button>
                <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                  View All
                </button>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                    Tailor
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                    Completed
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {completedOrders.map((order) => (
                  <CompletedOrderRow key={order.id} {...order} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

// Enhanced Stats Card Component
const StatsCard = ({
  title,
  value,
  icon,
  color = "bg-orange-500",
  change,
  changeColor,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-l-orange-500 transform hover:-translate-y-1">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">
              {title}
            </p>
            <h4 className="font-bold text-3xl mt-2 text-gray-800">{value}</h4>
            <div className="mt-3 flex items-center">
              <span className={`text-sm font-medium ${changeColor}`}>
                {change}
              </span>
              <span className="text-gray-500 text-sm ml-2">vs last month</span>
            </div>
          </div>
          <div
            className={`flex items-center justify-center w-16 h-16 rounded-xl ${color} text-white shadow-lg`}
          >
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};

// Booking Row Component
const BookingRow = ({
  id,
  customerName,
  phone,
  service,
  appointmentDate,
  status,
  statusColor,
  amount,
}) => {
  const statusClasses = {
    green: "bg-green-100 text-green-800 border border-green-200",
    red: "bg-red-100 text-red-800 border border-red-200",
    yellow: "bg-yellow-100 text-yellow-800 border border-yellow-200",
  };

  const statusClass =
    statusClasses[statusColor] ||
    "bg-gray-100 text-gray-800 border border-gray-200";

  return (
    <tr className="hover:bg-gray-50 transition-colors duration-200">
      <td className="px-4 py-4">
        <div>
          <div className="font-medium text-gray-900">{customerName}</div>
          <div className="text-sm text-gray-500 flex items-center">
            <FaPhone className="mr-1" /> {phone}
          </div>
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="font-medium text-gray-700">{service}</div>
        <div className="text-sm text-green-600 font-medium">{amount}</div>
      </td>
      <td className="px-4 py-4 text-sm text-gray-500">{appointmentDate}</td>
      <td className="px-4 py-4">
        <span
          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusClass}`}
        >
          {status}
        </span>
      </td>
    </tr>
  );
};

// Employee Row Component
const EmployeeRow = ({
  id,
  name,
  position,
  specialization,
  joinDate,
  experience,
  salary,
}) => {
  return (
    <tr className="hover:bg-gray-50 transition-colors duration-200">
      <td className="px-4 py-4">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-medium mr-3">
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-medium text-gray-900">{name}</div>
            <div className="text-sm text-gray-500">{experience} exp</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="font-medium text-gray-700">{position}</div>
        <div className="text-sm text-green-600 font-medium">{salary}</div>
      </td>
      <td className="px-4 py-4 text-sm text-gray-600">{specialization}</td>
      <td className="px-4 py-4 text-sm text-gray-500">{joinDate}</td>
    </tr>
  );
};

// Completed Order Row Component
const CompletedOrderRow = ({
  id,
  customerName,
  item,
  tailor,
  completedDate,
  amount,
  paymentStatus,
  rating,
}) => {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-sm ${
          i < rating ? "text-yellow-400" : "text-gray-300"
        }`}
      >
        ★
      </span>
    ));
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors duration-200">
      <td className="px-4 py-4">
        <button className="text-blue-600 font-semibold hover:text-blue-800 transition-colors">
          #{id}
        </button>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm font-medium mr-3">
            {customerName.charAt(0).toUpperCase()}
          </div>
          <span className="font-medium text-gray-900">{customerName}</span>
        </div>
      </td>
      <td className="px-4 py-4 font-medium text-gray-700">{item}</td>
      <td className="px-4 py-4 text-gray-600">{tailor}</td>
      <td className="px-4 py-4 text-sm text-gray-500">{completedDate}</td>
      <td className="px-4 py-4 font-semibold text-green-600">{amount}</td>
      <td className="px-4 py-4">
        <span
          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
            paymentStatus === "Paid"
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-red-100 text-red-800 border border-red-200"
          }`}
        >
          {paymentStatus}
        </span>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center">
          {renderStars(rating)}
          <span className="ml-2 text-sm text-gray-500">({rating}/5)</span>
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center space-x-2">
          <button className="p-1 text-blue-600 hover:text-blue-800 transition-colors">
            <FaEye />
          </button>
          <button className="p-1 text-gray-600 hover:text-gray-800 transition-colors">
            <FaEdit />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default Dashboard;
