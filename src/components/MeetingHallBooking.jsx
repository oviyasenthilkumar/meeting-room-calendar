import { useState } from "react";
import { serverTimestamp } from "firebase/firestore";
import { db } from '../components/firebaseConfig'; 
import { collection, addDoc, getDocs, onSnapshot } from "firebase/firestore";
import { auth } from "../components/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect } from "react";
import logo from "../assets/logo.png"
import { doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


export default function MeetingHallBooking() {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [userName, setUserName] = useState("User");
  const [userRole, setUserRole] = useState("User");
 const [currentDate, setCurrentDate] = useState(() => {
     const today = new Date();
     today.setHours(0, 0, 0, 0);
     return today;
   });
  const [viewMode, setViewMode] = useState("month");
  const [bookings, setBookings] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      setUserEmail(user.email);
    } else {
      setUserEmail("");
    }
  });

  return () => unsubscribe(); 
}, []);

useEffect(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (viewMode === "week") {
    const day = today.getDay();
    const diffToMonday = (day === 0 ? -6 : 1) - day;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diffToMonday);
    setCurrentWeekStart(monday);
    setCurrentDate(monday);
  } else if (viewMode === "day") {
    setCurrentDate(today);
  }
}, [viewMode]);

const [currentWeekStart, setCurrentWeekStart] = useState(() => {
  const today = new Date();
  const day = today.getDay();
  const diffToMonday = (day === 0 ? -6 : 1) - day;
  today.setDate(today.getDate() + diffToMonday);
  today.setHours(0, 0, 0, 0);
  return today;
});

const handleNext = () => {
  if (viewMode === "month") {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  } else if (viewMode === "week") {
    const nextWeek = new Date(currentWeekStart);
    nextWeek.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeekStart(nextWeek);
    setCurrentDate(nextWeek);
  } else if (viewMode === "day") {
    const nextDay = new Date(currentDate);
    nextDay.setDate(currentDate.getDate() + 1);
    setCurrentDate(nextDay);
  }
};

const handleBack = () => {
  if (viewMode === "month") {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  } else if (viewMode === "week") {
    const prevWeek = new Date(currentWeekStart);
    prevWeek.setDate(currentWeekStart.getDate() - 7);
    setCurrentWeekStart(prevWeek);
    setCurrentDate(prevWeek);
  } else if (viewMode === "day") {
    const prevDay = new Date(currentDate);
    prevDay.setDate(currentDate.getDate() - 1);
    setCurrentDate(prevDay);
  }
};

const handleToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  setCurrentDate(today);

  if (viewMode === "week") {
    const day = today.getDay();
    const diffToMonday = (day === 0 ? -6 : 1) - day;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diffToMonday);
    setCurrentWeekStart(monday);
  }
};

  const [formData, setFormData] = useState({
    name: "",
    persons: "",
    start: "",
    end: "",
    room: "",
    reason: "",
    status: "pending",
  });

  const [warning, setWarning] = useState("");

  const calculateDuration = (start, end) => {
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);

    const startMin = sh * 60 + sm;
    const endMin = eh * 60 + em;
    const durationMin = endMin - startMin;

    if (durationMin <= 0) return "Invalid time";

    const hours = Math.floor(durationMin / 60);
    const minutes = durationMin % 60;

    return `${hours > 0 ? `${hours} hr${hours > 1 ? "s" : ""} ` : ""}${
      minutes > 0 ? `${minutes} min` : ""
    }`;
  };

useEffect(() => {
  const fetchBookings = async () => {
      setIsLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "meetings"));
      const fetched = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Fetched bookings from Firebase:", fetched);
      setBookings(fetched);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
      setIsLoading(false);
  };

  fetchBookings();
}, []);

useEffect(() => {
    setIsLoading(true);
  const unsubscribe = onSnapshot(collection(db, "meetings"), (snapshot) => {
    const firebaseBookings = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("Live bookings from Firebase:", firebaseBookings);
    setBookings(firebaseBookings);
      setIsLoading(false);
  });

  return () => unsubscribe(); // Cleanup listener on unmount
}, []);

  const formatTime12Hour = (time24) => {
    if (!time24) return "";
    const [hour, minute] = time24.split(":");
    const h = parseInt(hour);
    const ampm = h >= 12 ? "PM" : "AM";
    const formattedHour = h % 12 === 0 ? 12 : h % 12;
    return `${formattedHour}:${minute} ${ampm}`;
  };

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (year, month) =>
    new Date(year, month + 1, 0).getDate();
  const getStartDay = (year, month) => new Date(year, month, 1).getDay();

  const changeMonth = (offset) =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1)
    );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const startDay = getStartDay(year, month);
  const todayStr = new Date().toDateString();

  const openModal = (day) => {
    const date = new Date(year, month, day);
    setSelectedDate(date);
    setFormData({
      name: "",
      persons: "",
      start: "",
      end: "",
      room: "",
      reason: "",
      status: "pending",
    });

    setWarning("");
    setModalOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const bookingRef = doc(db, "meetings", selectedBooking.id);
      await updateDoc(bookingRef, {
        ...formData,
        duration: calculateDuration(formData.start, formData.end),
        updatedAt: serverTimestamp(),
      });

      const updated = bookings.map((b) =>
        b.id === selectedBooking.id ? { ...b, ...formData } : b
      );
      setBookings(updated);
      setModalOpen(false);
      setSelectedBooking(null);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating booking:", err); 
      setWarning("Update failed. Try again.");
    }
  };

 const renderCalendarCells = () => {
   const cells = [];
   const today = new Date();
   today.setHours(0, 0, 0, 0);
    const todayStr = today.toDateString();

   const totalSlots = startDay + daysInMonth;
   const totalRows = Math.ceil(totalSlots / 7);
   const totalCells = totalRows * 7;

   for (let i = 0; i < totalCells; i++) {
     const cellIndex = i - startDay + 1;
     const isInMonth = cellIndex >= 1 && cellIndex <= daysInMonth;

     if (!isInMonth) {
       cells.push(
          <div
            key={`empty-${i}`}
            className="border border-gray-200 min-h-[5rem] sm:min-h-[6rem] bg-gray-50"
          />
       );
       continue;
     }

     const d = cellIndex;
     const date = new Date(year, month, d);
     date.setHours(0, 0, 0, 0);
     const dateStr = date.toDateString();
     const events = bookings.filter((b) => b.date === dateStr);
     const isToday = dateStr === todayStr;
     const isPast = date < today;

     const handleClick = () => {
       if (!isPast) {
         setSelectedDate(date);
          setSelectedBooking(null);
         setFormData({
           name: "",
           persons: "",
           start: "",
           end: "",
           room: "",
           reason: "",
         });
         setIsEditing(false);
         setWarning("");
         setModalOpen(true);
       }
     };

     cells.push(
       <div
         key={d}
         onClick={handleClick}
          className={`
            border border-gray-200 rounded-sm p-2 relative 
            transition duration-150 ease-in-out group 
            text-xs sm:text-sm 
            cursor-${isPast ? "not-allowed" : "pointer"}
            min-h-[5.5rem] sm:min-h-[7rem] 
            ${isPast
             ? "bg-gray-100 text-gray-400"
             : isToday
              ? "bg-blue-50 ring-2 ring-blue-400"
              : "bg-white hover:bg-blue-100/40"}
          `}
       >
          <div className="text-right font-semibold text-gray-600">
           {d}
         </div>
  
          <div className="absolute top-6 left-1 right-1 space-y-1 overflow-hidden">
           {events.slice(0, 3).map((b, i) => (
             <div
               key={i}
                title={`${b.name} (${b.room})`}
                className="bg-blue-600 text-white text-[11px] px-1.5 py-0.5 rounded shadow-sm truncate hover:bg-blue-700 transition"
               onClick={(e) => {
                 e.stopPropagation();
                 if (b.email === userEmail) {
                   setSelectedDate(date);
                   setSelectedBooking(b);
                   setFormData(b);
                   setIsEditing(false);
                   setWarning("");
                   setModalOpen(true);
                 } else {
                   toast.warning("You are not allowed to edit this booking.");
                 }
               }}
             >
               {b.name} ({b.room})
             </div>
           ))}
  
            {events.length > 3 && (
             <div
                className="text-blue-600 text-xs underline cursor-pointer hover:text-blue-800"
               onClick={(e) => {
                 e.stopPropagation();
                 setSelectedDate(date);
                 setFormData({
                   name: "_viewmore",
                   persons: "",
                   start: "",
                   end: "",
                   room: "",
                   reason: "",
                 });
                 setModalOpen(true);
               }}
             >
               +{events.length - 3} more
             </div>
           )}
         </div>
       </div>
     );
   }
  
   return cells;
 };
  
  

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    let updated = { ...formData, [name]: value };
    if (name === "persons") {
      const p = parseInt(value);
      updated.room = p <= 2 ? "Room 1" : p <= 5 ? "Room 2" : "Room 3";
    }
    setFormData(updated);
    setWarning("");
  };

  const isTimeOverlap = (start1, end1, start2, end2) => {
    return !(end1 <= start2 || start1 >= end2);
  };

const handleSubmit = async () => {
  const selectedDateStr = selectedDate.toDateString();

  // Check if any required field is empty
  if (
    !formData.name.trim() ||
    !formData.persons ||
    !formData.start ||
    !formData.end ||
    !formData.reason.trim() ||
    !formData.room
  ) {
    setWarning("Please fill in all fields before submitting.");
    return;
  }

  // ✅ Time validation
  if (formData.end <= formData.start) {
    setWarning("End time must be after start time.");
    return;
  }

  const nextId =
    bookings.length > 0
      ? Math.max(...bookings.map((b) => parseInt(b.userId || 0))) + 1
      : 1;

  const newBooking = {
    date: selectedDateStr,
    ...formData,
    email: userEmail,
    status: "pending",
    duration: calculateDuration(formData.start, formData.end),
    userId: nextId.toString(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  try {
    await addDoc(collection(db, "meetings"), newBooking);
    setBookings([...bookings, newBooking]);
    setFormData({
      name: "",
      persons: "",
      start: "",
      end: "",
      room: "",
      reason: "",
      status: "pending",
    });
    setModalOpen(false);
    setWarning("");
  } catch (error) {
    console.error("Error saving to Firestore:", error);
    setWarning("Failed to save booking. Please try again.");
  }
};

  const statusIcon = (status) => {
    if (status === 'accepted') return <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2 align-middle" title="Accepted" />;
    if (status === 'pending') return <span className="inline-block w-3 h-3 rounded-full bg-yellow-400 mr-2 align-middle" title="Pending" />;
    if (status === 'rejected') return <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-2 align-middle" title="Rejected" />;
    return null;
  };

  const renderTodaysSchedule = () => {
    const todaysBookings = bookings.filter((b) => b.date === todayStr);
    return (
      <div className="bg-gray-100 rounded-lg p-4">
        <h3 className="font-semibold mb-2">Today's Schedule</h3>
        <div className="bg-white shadow-sm rounded-lg p-2 text-sm">
          <p className="text-blue-600 font-semibold">
            {new Date().toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </p>
          {todaysBookings.length > 0 ? (
            <ul className="mt-2 text-left space-y-1">
              {todaysBookings.map((b, i) => (
                <li key={i} className="text-gray-700 flex items-center">
                  {statusIcon(b.status)}
                  <strong>{b.name}</strong> - {formatTime12Hour(b.start)} to {formatTime12Hour(b.end)} ({b.room})
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No bookings today</p>
          )}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    const weekDays = [...Array(7)].map((_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
        {weekDays.map((day, idx) => {
          const dayStr = day.toDateString();
          const events = bookings.filter((b) => b.date === dayStr);
          return (
            <div key={idx} className="border border-gray-300 rounded p-2 bg-white shadow-sm">
              <div className="text-sm font-semibold text-gray-700 mb-1">
                {day.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </div>
              {events.length > 0 ? (
                events.map((b, i) => (
                  <div
                    key={i}
                    className="bg-blue-600 text-white text-xs px-2 py-1 rounded mb-1"
                  >
                    {b.start}–{b.end}: {b.name} ({b.room})
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400">No bookings</p>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderDayView = () => {
    const dayStr = currentDate.toDateString();
    const events = bookings.filter((b) => b.date === dayStr);

    return (
      <div className="bg-white border border-gray-300 rounded p-4 shadow-sm">
        <h3 className="font-semibold text-gray-700 mb-2">
          {currentDate.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </h3>
        {events.length > 0 ? (
          <ul className="space-y-2 text-sm">
            {events.map((b, i) => (
              <li key={i} className="bg-blue-100 px-2 py-1 rounded">
                <strong>{b.name}</strong> ({b.room})<br />
                {b.start} – {b.end}
                <br />
                {b.reason && (
                  <span className="italic text-xs text-gray-500">
                    {b.reason}
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No bookings for today</p>
        )}
      </div>
    );
  };

  const renderAgendaView = () => {
    const sortedBookings = [...bookings].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    return (
      <div className="bg-white border border-gray-300 rounded p-4 shadow-sm text-sm">
        <h3 className="font-semibold text-gray-700 mb-2">Agenda View</h3>
        {sortedBookings.length > 0 ? (
          <ul className="space-y-2">
            {sortedBookings.map((b, i) => (
              <li key={i} className="border-b border-gray-300 pb-2">
                <div className="text-blue-600 font-medium">
                  {new Date(b.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                <div>
                  <strong>{b.name}</strong> ({b.room})<br />
                  {b.start} – {b.end}
                  <br />
                  {b.reason && (
                    <span className="italic text-gray-500">{b.reason}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No upcoming bookings</p>
        )}
      </div>
    );
  };

  const renderMiniCalendar = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const startDay = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun
    const selectedDay = today.getDate(); // Only today should be selectable

    const calendarCells = [];

    for (let i = 0; i < startDay; i++) {
      calendarCells.push(
        <div key={`empty-${i}`} className="text-center py-1"></div>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const thisDate = new Date(currentYear, currentMonth, day);
      thisDate.setHours(0, 0, 0, 0);
      const isToday = thisDate.getTime() === today.getTime();

      calendarCells.push(
        <div
          key={day}
          className={`text-center rounded-full w-8 h-8 flex items-center justify-center mx-auto ${
            isToday
              ? "bg-blue-600 text-white font-semibold cursor-default"
              : "text-gray-400 cursor-not-allowed"
          }`}
        >
          {day}
        </div>
      );
    }

    return (
      <div className="bg-gray-100 rounded-lg p-4">
        <h3 className="font-semibold text-center mb-3">Appointment Calendar</h3>
        <div className="grid grid-cols-7 text-center text-sm text-gray-700 font-medium mb-1">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 text-sm text-gray-800">
          {calendarCells}
        </div>
      </div>
    );
  };

 const handleSignOut = async () => {
  try {
    await signOut(auth);
    toast.success('Signed out successfully!');
    navigate('/');
  } catch (error) {
    toast.warning('Sign out failed: ' + error.message);
  }
};

  useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setUserName(user.displayName || "User");
          setUserEmail(user.email || "");
        } else {
          setUserName("User");
          setUserEmail("");
        }
      });
      return () => unsubscribe();
    }, []);

  // Helper to get user initial
  const getUserInitial = () => {
    if (userName && userName.trim().length > 0) return userName[0].toUpperCase();
    if (userEmail && userEmail.trim().length > 0) return userEmail[0].toUpperCase();
    return 'U';
  };

  return (
    <div className="min-h-screen bg-gray-100 relative ">
      {/* Hamburger for mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-40 bg-blue-600 text-white p-2 rounded"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-menu"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
      {/* Mobile sidebar drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex">
          <div className="bg-white w-3/4 max-w-xs p-4 space-y-4">
            {/* Sidebar content (copy from below) */}
            <h2 className="text-blue-600 font-bold text-lg">Appointment</h2>
            <div className="bg-gray-100 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Appointment Calendar</h3>
              {renderMiniCalendar()}
            </div>
            {renderTodaysSchedule()}
            <div className="mt-4 flex justify-center">
              <img src={logo} alt="Senthuron Tech" className="h-6" />
              <span className="font-bold px-5 text-sm align-middle">Senthuron Tech</span>
            </div>
            <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded" onClick={() => setSidebarOpen(false)}>Close</button>
          </div>
          <div className="flex-1" onClick={() => setSidebarOpen(false)} />
        </div>
      )}
      {/* Profile Section Header - Top Right Corner */}
      <div className="absolute top-4 right-4 z-30 max-w-full">
        <div className="relative">
          <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center space-x-4 rounded-md px-3 py-2 hover:bg-gray-100 transition"
          >
            {/* Avatar Image */}
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg border border-blue-700">
              {getUserInitial()}
            </div>
            <svg
              className="h-5 w-5 text-gray-600"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {showProfileDropdown && (
            <div className="absolute right-0 z-20 mt-2 w-72 origin-top-right rounded-lg bg-gray-100 shadow-lg ring-1 ring-gray-300 ring-opacity-5 flex flex-col items-center p-6" style={{minWidth: '280px'}}>
              {/* Triangle pointer */}
              <div className="absolute -top-2 right-8 w-4 h-4">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-100 drop-shadow" style={{position: 'absolute', top: 0, left: 0}}>
                  <polygon points="12,0 24,24 0,24" fill="#f3f4f6" />
                </svg>
              </div>
              {/* Avatar */}
               <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full border-2 border-blue-500 flex items-center justify-center mb-2 bg-blue-100">
                  <span className="text-2xl text-blue-700 font-bold">
                    {getUserInitial(userName, userEmail)}
                  </span>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg text-gray-800">{userName}</div>
                  <div className="text-gray-600 text-sm mb-2">{userEmail}</div>
                  <button
                    className="border border-red-400 text-red-500 px-4 py-1 rounded-md hover:bg-red-50 transition text-sm"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Main Content */}
      <div className="bg-white shadow-sm ">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo Section */}
            <div className="flex items-center space-x-3">
              {/* You can put your logo here if needed */}
            </div>
          </div>
        </div>
      </div>
      <div className="min-h-screen bg-white p-4 sm:p-4">
        <div className="bg-white p-2 sm:p-4">
          <div className="flex flex-col md:flex-row">
            {/* Sidebar: hidden on mobile, visible on md+ */}
            <div className="hidden md:block w-full md:w-1/5 space-y-4">
              <h2 className="text-blue-600 font-bold text-lg">Appointment</h2>
              <div className="bg-gray-100 rounded-lg p-4">
                {/* <h3 className="font-semibold mb-2">Appointment Calendar</h3> */}
              {renderMiniCalendar()}
            </div>
            {renderTodaysSchedule()}
            <div className="bg-gray-100 rounded-lg p-4 text-sm space-y-2">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span>Accepted</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                <span>Pending</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span>Rejected</span>
              </div>
            </div>
              <div className="mt-4 flex justify-center mt-30 mr-10">
                <img src={logo} alt="Senthuron Tech" className="h-6" />
                <span className="font-bold px-3 text-lg align-middle">Senthuron Tech</span>
            </div>
          </div>
            {/* Main calendar/content area */}
            <div className="w-full md:w-4/5 px-4  mx-auto">
  <div className="bg-white shadow-lg rounded-2xl p-1">
    <h1 className="text-3xl font-extrabold text-blue-700 text-center mb-3">
              Meeting Hall Booking
            </h1>
    <p className="text-center text-gray-500 text-base mb-6">
              {viewMode === "month"
                ? `${currentDate.toLocaleString("default", {
                    month: "long",
                  })} ${year}`
                : currentDate.toDateString()}
            </p>

    {/* Navigation Controls */}
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
      <div className="flex gap-2">
                <button
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 active:scale-95 focus:ring-2 focus:ring-blue-400 text-sm rounded-lg transition-all duration-150 shadow-sm"
                  onClick={handleToday}
                >
                  Today
                </button>
                <button
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 active:scale-95 focus:ring-2 focus:ring-blue-400 text-sm rounded-lg transition-all duration-150 shadow-sm"
                  onClick={handleBack}
                >
                  Back
                </button>
                <button
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 active:scale-95 focus:ring-2 focus:ring-blue-400 text-sm rounded-lg transition-all duration-150 shadow-sm"
                  onClick={handleNext}
                >
                  Next
                </button>
              </div>

      {/* View Mode Buttons */}
      <div className="flex gap-2">
                {["month", "week", "day", "agenda"].map((m) => (
                  <button
                    key={m}
            className={`px-4 py-2 text-sm rounded-lg transition border border-gray-300 ${
              viewMode === m
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white hover:bg-gray-100 border-gray-300"
                    }`}
                    onClick={() => setViewMode(m)}
                  >
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </button>
                ))}
              </div>
            </div>

    {/* Calendar Container */}
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
        </div>
      ) : (
        <>
            {viewMode === "month" && (
            <div className="min-w-[800px] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 border-t border-l border-gray-300 text-sm">
                {days.map((d) => (
                  <div
                    key={d}
                  className="border-b border-r border-gray-300 p-3 font-semibold text-center bg-gray-50 text-gray-700"
                  >
                    {d}
                  </div>
                ))}
                {renderCalendarCells()}
              </div>
            )}
            {viewMode === "week" && renderWeekView()}
            {viewMode === "day" && renderDayView()}
            {viewMode === "agenda" && renderAgendaView()}
        </>
      )}
    </div>
          </div>
</div>

        </div>

        {modalOpen && (
          <div className="fixed inset-0 flex items-center justify-center  bg-[rgba(0,0,0,0.5)]">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
              <h2 className="text-xl font-bold mb-4">
                {selectedBooking ? "Edit Booking" : "Book Room"} -{" "}
                {selectedDate?.toDateString()}
              </h2>

              <div className="space-y-4">
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Name"
                    className="w-full border border-gray-300 px-4 py-2 rounded text-sm"
                  required
                />

                <input
                  name="persons"
                  type="number"
                  value={formData.persons}
                  onChange={handleFormChange}
                  placeholder="Number of Persons"
                    className="w-full border border-gray-300 px-4 py-2 rounded text-sm"
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs mb-1">Start Time</label>
                    <input
                      name="start"
                      type="time"
                      value={formData.start}
                      onChange={handleFormChange}
                        className="w-full border border-gray-300 px-4 py-2 rounded text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">End Time</label>
                    <input
                      name="end"
                      type="time"
                      value={formData.end}
                      onChange={handleFormChange}
                        className="w-full border border-gray-300 px-4 py-2 rounded text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Duration Field */}
                {formData.start && formData.end && (
                  <p className="text-sm text-gray-600">
                    Duration:{" "}
                    <strong>
                      {calculateDuration(formData.start, formData.end)}
                    </strong>
                  </p>
                )}

                <input
                  name="room"
                  value={formData.room}
                  readOnly
                    className="w-full border border-gray-300 px-4 py-2 rounded bg-gray-100 text-sm"
                />

                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleFormChange}
                  placeholder="Reason for Booking"
                    className="w-full border border-gray-300 px-4 py-2 rounded text-sm"
                  rows={3}
                  required
                />

                {warning && <p className="text-red-500 text-sm">{warning}</p>}

                {/* Footer Buttons */}
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    className="bg-gray-300 px-4 py-2 rounded text-sm"
                    onClick={() => {
                      setModalOpen(false);
                      setSelectedBooking(null);
                      setIsEditing(false);
                    }}
                  >
                    Cancel
                  </button>
                  {selectedBooking ? (
                    selectedBooking.email !== userEmail ? (
                      <p className="text-red-500 text-sm">
                        You cannot edit this booking. It was made by another
                        user.
                      </p>
                    ) : (
                      <button
                        className="bg-green-600 text-white px-4 py-2 rounded text-sm"
                        onClick={handleUpdate}
                      >
                        Save Changes
                      </button>
                    )
                  ) : (
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
                      onClick={handleSubmit}
                    >
                      Book
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}