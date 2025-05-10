// import { useState } from "react";
// // import { collection, addDoc } from 'firebase/firestore';
// import { db } from '../components/firebaseConfig'; // adjust the path if needed
// import { collection, addDoc, getDocs, onSnapshot } from "firebase/firestore";
// import { doc, updateDoc } from "firebase/firestore";
// import { useEffect } from "react";

// export default function MeetingHallBooking() {
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [viewMode, setViewMode] = useState("month");
//   const [bookings, setBookings] = useState([]);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [formData, setFormData] = useState({
//     name: "",
//     persons: "",
//     start: "",
//     end: "",
//     room: "",
//     reason: "",
//   });
//   const [warning, setWarning] = useState("");
//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         const snapshot = await getDocs(collection(db, "meetings"));
//         const fetched = snapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         console.log("Fetched bookings from Firebase:", fetched);
//         setBookings(fetched);
//       } catch (err) {
//         console.error("Error fetching bookings:", err);
//       }
//     };

//     fetchBookings();
//   }, []);
//   useEffect(() => {
//     const unsubscribe = onSnapshot(collection(db, "meetings"), (snapshot) => {
//       const firebaseBookings = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       console.log("Live bookings from Firebase:", firebaseBookings);
//       setBookings(firebaseBookings);
//     });

//     return () => unsubscribe(); // Cleanup listener on unmount
//   }, []);

//   const formatTime12Hour = (time24) => {
//     if (!time24) return "";
//     const [hour, minute] = time24.split(":");
//     const h = parseInt(hour);
//     const ampm = h >= 12 ? "PM" : "AM";
//     const formattedHour = h % 12 === 0 ? 12 : h % 12;
//     return `${formattedHour}:${minute} ${ampm}`;
//   };

//   const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

//   const getDaysInMonth = (year, month) =>
//     new Date(year, month + 1, 0).getDate();
//   const getStartDay = (year, month) => new Date(year, month, 1).getDay();
//   const changeMonth = (offset) =>
//     setCurrentDate(
//       new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1)
//     );

//   const year = currentDate.getFullYear();
//   const month = currentDate.getMonth();
//   const daysInMonth = getDaysInMonth(year, month);
//   const startDay = getStartDay(year, month);
//   const todayStr = new Date().toDateString();

//   // const openModal = (day) => {
//   //   const date = new Date(year, month, day);
//   //   setSelectedDate(date);
//   //   setFormData({
//   //     name: "",
//   //     persons: "",
//   //     start: "",
//   //     end: "",
//   //     room: "",
//   //     reason: "",
//   //   });
//   //   setWarning("");
//   //   setModalOpen(true);
//   // };
//   // Updated renderCalendarCells function
//   // const renderCalendarCells = () => {
//   //   const cells = [];
//   //   for (let i = 0; i < startDay; i++) {
//   //     cells.push(
//   //       <div key={`empty-${i}`} className="border h-24 bg-white"></div>
//   //     );
//   //   }
//   //   for (let d = 1; d <= daysInMonth; d++) {
//   //     const dateStr = new Date(year, month, d).toDateString();
//   //     const events = bookings.filter((b) => b.date === dateStr);
//   //     const isToday = dateStr === todayStr;

//   //     cells.push(
//   //       <div
//   //         key={d}
//   //         onClick={() => openModal(d)}
//   //         className={`border h-24 p-2 relative hover:bg-blue-50 cursor-pointer transition duration-150 ease-in-out ${
//   //           isToday ? "bg-blue-100" : "bg-white"
//   //         }`}
//   //       >
//   //         <div className="text-right text-xs font-semibold text-gray-600">
//   //           {d}
//   //         </div>
//   //         <div className="absolute top-5 left-1 right-1">
//   //           {events.map((b, i) => (
//   //             <div
//   //               key={i}
//   //               className="bg-blue-600 text-white text-[11px] px-1 py-0.5 rounded mb-1 overflow-hidden whitespace-nowrap truncate"
//   //             >
//   //               {b.name} ({b.room})
//   //             </div>
//   //           ))}
//   //         </div>
//   //       </div>
//   //     );
//   //   }
//   //   return cells;
//   // };
//   // Updates to calendar cells for disabling past dates and showing +N users overflow

//   // const renderCalendarCells = () => {
//   //   const cells = [];
//   //   const today = new Date();
//   //   today.setHours(0, 0, 0, 0);

//   //   const totalSlots = startDay + daysInMonth;
//   //   const totalRows = Math.ceil(totalSlots / 7);
//   //   const totalCells = totalRows * 7;

//   //   for (let i = 0; i < totalCells; i++) {
//   //     const cellIndex = i - startDay + 1;
//   //     const isInMonth = cellIndex >= 1 && cellIndex <= daysInMonth;

//   //     if (!isInMonth) {
//   //       cells.push(
//   //         <div key={`empty-${i}`} className="border h-24 bg-white"></div>
//   //       );
//   //       continue;
//   //     }

//   //     const d = cellIndex;
//   //     const date = new Date(year, month, d);
//   //     date.setHours(0, 0, 0, 0);
//   //     const dateStr = date.toDateString();
//   //     const events = bookings.filter((b) => b.date === dateStr);
//   //     const isToday = dateStr === todayStr;
//   //     const isPast = date < today;
//   //     const showAll =
//   //       selectedDate?.toDateString() === dateStr &&
//   //       modalOpen &&
//   //       formData.name === "_viewmore";

//   //     const handleClick = () => {
//   //       if (!isPast) {
//   //         setSelectedDate(date);
//   //         setFormData({
//   //           name: "",
//   //           persons: "",
//   //           start: "",
//   //           end: "",
//   //           room: "",
//   //           reason: "",
//   //         });
//   //         setWarning("");
//   //         setModalOpen(true);
//   //       }
//   //     };

//   //     cells.push(
//   //       <div
//   //         key={d}
//   //         onClick={!isPast ? handleClick : undefined}
//   //         className={`border h-24 p-2 relative transition duration-150 ease-in-out ${
//   //           isPast
//   //             ? "bg-gray-200 text-gray-400 cursor-not-allowed"
//   //             : isToday
//   //             ? "bg-blue-100 cursor-pointer"
//   //             : "bg-white hover:bg-blue-50 cursor-pointer"
//   //         }`}
//   //       >
//   //         <div className="text-right text-xs font-semibold text-gray-600">
//   //           {d}
//   //         </div>
//   //         <div className="absolute top-5 left-1 right-1">
//   //           {events.slice(0, 3).map((b, i) => (
//   //             <div
//   //               key={i}
//   //               className="bg-blue-600 text-white text-[11px] px-1 py-0.5 rounded mb-1 overflow-hidden whitespace-nowrap truncate"
//   //             >
//   //               {b.name} ({b.room})
//   //             </div>
//   //           ))}
//   //           {events.length > 3 && !isPast && (
//   //             <div
//   //               className="text-blue-600 text-xs underline cursor-pointer"
//   //               onClick={(e) => {
//   //                 e.stopPropagation();
//   //                 setSelectedDate(date);
//   //                 setFormData({
//   //                   name: "_viewmore",
//   //                   persons: "",
//   //                   start: "",
//   //                   end: "",
//   //                   room: "",
//   //                   reason: "",
//   //                 });
//   //                 setModalOpen(true);
//   //               }}
//   //             >
//   //               +{events.length - 3} more
//   //             </div>
//   //           )}
//   //         </div>
//   //       </div>
//   //     );
//   //   }
//   //   return cells;
//   // };
//   const renderCalendarCells = () => {
//     const cells = [];
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const totalSlots = startDay + daysInMonth;
//     const totalRows = Math.ceil(totalSlots / 7);
//     const totalCells = totalRows * 7;

//     for (let i = 0; i < totalCells; i++) {
//       const cellIndex = i - startDay + 1;
//       const isInMonth = cellIndex >= 1 && cellIndex <= daysInMonth;

//       if (!isInMonth) {
//         cells.push(
//           <div key={`empty-${i}`} className="border h-24 bg-white"></div>
//         );
//         continue;
//       }

//       const d = cellIndex;
//       const date = new Date(year, month, d);
//       date.setHours(0, 0, 0, 0);
//       const dateStr = date.toDateString();
//       const events = bookings.filter((b) => b.date === dateStr);
//       const isToday = dateStr === todayStr;
//       const isPast = date < today;
//       const showAll =
//         selectedDate?.toDateString() === dateStr &&
//         modalOpen &&
//         formData.name === "_viewmore";

//       const handleClick = () => {
//         if (!isPast) {
//           setSelectedDate(date);
//           setFormData({
//             name: "",
//             persons: "",
//             start: "",
//             end: "",
//             room: "",
//             reason: "",
//           });
//           setWarning("");
//           setModalOpen(true);
//         }
//       };

//       cells.push(
//         <div
//           key={d}
//           onClick={handleClick}
//           className={`border h-24 p-2 relative transition duration-150 ease-in-out cursor-${
//             isPast ? "not-allowed" : "pointer"
//           } ${
//             isPast
//               ? "bg-gray-100 text-gray-400"
//               : isToday
//               ? "bg-blue-100"
//               : "bg-white hover:bg-blue-50"
//           }`}
//         >
//           <div className="text-right text-xs font-semibold text-gray-600">
//             {d}
//           </div>
//           <div className="absolute top-5 left-1 right-1">
//             {events.slice(0, 3).map((b, i) => (
//               <div
//                 key={i}
//                 className="bg-blue-600 text-white text-[11px] px-1 py-0.5 rounded mb-1 overflow-hidden whitespace-nowrap truncate"
//               >
//                 {b.name} ({b.room})
//               </div>
//             ))}
//             {events.length > 3 && (
//               <div
//                 className="text-blue-600 text-xs underline cursor-pointer"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setSelectedDate(date);
//                   setFormData({
//                     name: "_viewmore",
//                     persons: "",
//                     start: "",
//                     end: "",
//                     room: "",
//                     reason: "",
//                   });
//                   setModalOpen(true);
//                 }}
//               >
//                 +{events.length - 3} more
//               </div>
//             )}
//           </div>
//         </div>
//       );
//     }
//     return cells;
//   };
//   const handleFormChange = (e) => {
//     const { name, value } = e.target;
//     let updated = { ...formData, [name]: value };
//     if (name === "persons") {
//       const p = parseInt(value);
//       updated.room = p <= 2 ? "Room 1" : p <= 5 ? "Room 2" : "Room 3";
//     }
//     setFormData(updated);
//     setWarning("");
//   };

//   const isTimeOverlap = (start1, end1, start2, end2) => {
//     return !(end1 <= start2 || start1 >= end2);
//   };

//   // const handleSubmit = () => {
//   //   const selectedDateStr = selectedDate.toDateString();
//   //   setBookings([...bookings, { date: selectedDateStr, ...formData }]);
//   //   setFormData({
//   //     name: "",
//   //     persons: "",
//   //     start: "",
//   //     end: "",
//   //     room: "",
//   //     reason: "",
//   //   });
//   //   setModalOpen(false);
//   //   setWarning("");
//   // };
//   // Updated handleSubmit to save booking in Firestore
//   // const handleSubmit = async () => {
//   //   const selectedDateStr = selectedDate.toDateString();
//   //   const newBooking = { date: selectedDateStr, ...formData };
//   //   try {
//   //     await addDoc(collection(db, "meetings"), newBooking);
//   //     setBookings([...bookings, newBooking]);
//   //     setFormData({
//   //       name: "",
//   //       persons: "",
//   //       start: "",
//   //       end: "",
//   //       room: "",
//   //       reason: "",
//   //     });
//   //     setModalOpen(false);
//   //     setWarning("");
//   //   } catch (error) {
//   //     console.error("Error saving to Firestore:", error);
//   //     setWarning("Failed to save booking. Please try again.");
//   //   }
//   // };

//   const renderTodaysSchedule = () => {
//     const todaysBookings = bookings.filter((b) => b.date === todayStr);
//     return (
//       <div className="bg-gray-100 rounded-lg p-4">
//         <h3 className="font-semibold mb-2">Today's Schedule</h3>
//         <div className="bg-white shadow-sm rounded-lg p-2 text-sm">
//           <p className="text-blue-600 font-semibold">
//             {new Date().toLocaleDateString("en-US", {
//               weekday: "short",
//               month: "short",
//               day: "numeric",
//             })}
//           </p>
//           {todaysBookings.length > 0 ? (
//             <ul className="mt-2 text-left space-y-1">
//               {todaysBookings.map((b, i) => (
//                 <li key={i} className="text-gray-700">
//                   <strong>{b.name}</strong> - {formatTime12Hour(b.start)} to{" "}
//                   {formatTime12Hour(b.end)} ({b.room})
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p className="text-gray-500">No bookings today</p>
//           )}
//         </div>
//       </div>
//     );
//   };
//   const renderWeekView = () => {
//     const startOfWeek = new Date(currentDate);
//     startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
//     const weekDays = [...Array(7)].map((_, i) => {
//       const date = new Date(startOfWeek);
//       date.setDate(startOfWeek.getDate() + i);
//       return date;
//     });

//     return (
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
//         {weekDays.map((day, idx) => {
//           const dayStr = day.toDateString();
//           const events = bookings.filter((b) => b.date === dayStr);
//           return (
//             <div key={idx} className="border rounded p-2 bg-white shadow-sm">
//               <div className="text-sm font-semibold text-gray-700 mb-1">
//                 {day.toLocaleDateString("en-US", {
//                   weekday: "short",
//                   month: "short",
//                   day: "numeric",
//                 })}
//               </div>
//               {events.length > 0 ? (
//                 events.map((b, i) => (
//                   <div
//                     key={i}
//                     className="bg-blue-600 text-white text-xs px-2 py-1 rounded mb-1"
//                   >
//                     {b.start}–{b.end}: {b.name} ({b.room})
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-xs text-gray-400">No bookings</p>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     );
//   };

//   const renderDayView = () => {
//     const dayStr = currentDate.toDateString();
//     const events = bookings.filter((b) => b.date === dayStr);

//     return (
//       <div className="bg-white border rounded p-4 shadow-sm">
//         <h3 className="font-semibold text-gray-700 mb-2">
//           {currentDate.toLocaleDateString("en-US", {
//             weekday: "long",
//             month: "long",
//             day: "numeric",
//           })}
//         </h3>
//         {events.length > 0 ? (
//           <ul className="space-y-2 text-sm">
//             {events.map((b, i) => (
//               <li key={i} className="bg-blue-100 px-2 py-1 rounded">
//                 <strong>{b.name}</strong> ({b.room})<br />
//                 {b.start} – {b.end}
//                 <br />
//                 {b.reason && (
//                   <span className="italic text-xs text-gray-500">
//                     {b.reason}
//                   </span>
//                 )}
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p className="text-sm text-gray-500">No bookings for today</p>
//         )}
//       </div>
//     );
//   };

//   const renderAgendaView = () => {
//     const sortedBookings = [...bookings].sort(
//       (a, b) => new Date(a.date) - new Date(b.date)
//     );

//     return (
//       <div className="bg-white border rounded p-4 shadow-sm text-sm">
//         <h3 className="font-semibold text-gray-700 mb-2">Agenda View</h3>
//         {sortedBookings.length > 0 ? (
//           <ul className="space-y-2">
//             {sortedBookings.map((b, i) => (
//               <li key={i} className="border-b pb-2">
//                 <div className="text-blue-600 font-medium">
//                   {new Date(b.date).toLocaleDateString("en-US", {
//                     weekday: "short",
//                     month: "short",
//                     day: "numeric",
//                   })}
//                 </div>
//                 <div>
//                   <strong>{b.name}</strong> ({b.room})<br />
//                   {b.start} – {b.end}
//                   <br />
//                   {b.reason && (
//                     <span className="italic text-gray-500">{b.reason}</span>
//                   )}
//                 </div>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p className="text-gray-500">No upcoming bookings</p>
//         )}
//       </div>
//     );
//   };
//   const renderMiniCalendar = () => {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const currentYear = currentDate.getFullYear();
//     const currentMonth = currentDate.getMonth();
//     const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
//     const startDay = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun
//     const selectedDay = today.getDate(); // Only today should be selectable

//     const calendarCells = [];

//     for (let i = 0; i < startDay; i++) {
//       calendarCells.push(
//         <div key={`empty-${i}`} className="text-center py-1"></div>
//       );
//     }

//     for (let day = 1; day <= daysInMonth; day++) {
//       const thisDate = new Date(currentYear, currentMonth, day);
//       thisDate.setHours(0, 0, 0, 0);
//       const isToday = thisDate.getTime() === today.getTime();

//       calendarCells.push(
//         <div
//           key={day}
//           className={`text-center rounded-full w-8 h-8 flex items-center justify-center mx-auto ${
//             isToday
//               ? "bg-blue-600 text-white font-semibold cursor-default"
//               : "text-gray-400 cursor-not-allowed"
//           }`}
//         >
//           {day}
//         </div>
//       );
//     }

//     return (
//       <div className="bg-gray-100 rounded-lg p-4">
//         <h3 className="font-semibold text-center mb-3">Appointment Calendar</h3>
//         <div className="grid grid-cols-7 text-center text-sm text-gray-700 font-medium mb-1">
//           {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
//             <div key={d}>{d}</div>
//           ))}
//         </div>
//         <div className="grid grid-cols-7 text-sm text-gray-800">
//           {calendarCells}
//         </div>
//       </div>
//     );
//   };

//   // const renderMiniCalendar = () => {
//   //   const today = new Date();
//   //   const currentYear = currentDate.getFullYear();
//   //   const currentMonth = currentDate.getMonth();
//   //   const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
//   //   const startDay = new Date(currentYear, currentMonth, 1).getDay();
//   //   const selectedDay = currentDate.getDate();

//   //   const calendarCells = [];
//   //   for (let i = 0; i < startDay; i++) {
//   //     calendarCells.push(
//   //       <div key={`empty-${i}`} className="text-center py-1"></div>
//   //     );
//   //   }
//   //   for (let day = 1; day <= daysInMonth; day++) {
//   //     const isSelected = day === selectedDay;
//   //     calendarCells.push(
//   //       <div
//   //         key={day}
//   //         className={`text-center rounded-full w-8 h-8 flex items-center justify-center mx-auto cursor-pointer ${
//   //           isSelected
//   //             ? "bg-blue-600 text-white font-semibold"
//   //             : "hover:bg-blue-100"
//   //         }`}
//   //         onClick={() =>
//   //           setCurrentDate(new Date(currentYear, currentMonth, day))
//   //         }
//   //       >
//   //         {day}
//   //       </div>
//   //     );
//   //   }

//   //   return (
//   //     <div className="bg-gray-100 rounded-lg p-4">
//   //       {/* <h3 className="font-semibold text-center mb-3">Appointment Calendar</h3> */}
//   //       <div className="grid grid-cols-7 text-center text-sm text-gray-700 font-medium mb-1">
//   //         {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
//   //           <div key={d}>{d}</div>
//   //         ))}
//   //       </div>
//   //       <div className="grid grid-cols-7 text-sm text-gray-800">
//   //         {calendarCells}
//   //       </div>
//   //     </div>
//   //   );
//   // };
//   // Inside component
//   const [editMode, setEditMode] = useState(false);
//   const [editingId, setEditingId] = useState(null);

//   const openModal = (day, event = null) => {
//     const date = new Date(year, month, day);
//     setSelectedDate(date);

//     if (event) {
//       setFormData({
//         name: event.name,
//         persons: event.persons,
//         start: event.start,
//         end: event.end,
//         room: event.room,
//         reason: event.reason,
//       });
//       setEditingId(event.id);
//       setEditMode(false);
//     } else {
//       setFormData({
//         name: "",
//         persons: "",
//         start: "",
//         end: "",
//         room: "",
//         reason: "",
//       });
//       setEditingId(null);
//       setEditMode(false);
//     }

//     setWarning("");
//     setModalOpen(true);
//   };

//   const handleSubmit = async () => {
//     const selectedDateStr = selectedDate.toDateString();
//     const newBooking = { date: selectedDateStr, ...formData };

//     try {
//       if (editMode && editingId) {
//         const ref = doc(db, "meetings", editingId);
//         await updateDoc(ref, newBooking);
//         setBookings((prev) =>
//           prev.map((b) => (b.id === editingId ? { ...b, ...newBooking } : b))
//         );
//       } else {
//         const docRef = await addDoc(collection(db, "meetings"), newBooking);
//         setBookings([...bookings, { id: docRef.id, ...newBooking }]);
//       }

//       setFormData({
//         name: "",
//         persons: "",
//         start: "",
//         end: "",
//         room: "",
//         reason: "",
//       });
//       setModalOpen(false);
//       setWarning("");
//       setEditMode(false);
//       setEditingId(null);
//     } catch (error) {
//       console.error("Error saving to Firestore:", error);
//       setWarning("Failed to save booking. Please try again.");
//     }
//   };

//   // Updated calendar cell booking click
//   {
//     events.slice(0, 3).map((b, i) => (
//       <div
//         key={i}
//         className="bg-blue-600 text-white text-[11px] px-1 py-0.5 rounded mb-1 overflow-hidden whitespace-nowrap truncate cursor-pointer"
//         onClick={(e) => {
//           e.stopPropagation();
//           openModal(d, b);
//         }}
//       >
//         {b.name} ({b.room})
//       </div>
//     ));
//   }

//   return (
//     <div className="min-h-screen bg-white p-4">
//       <div className="min-h-screen bg-white p-4">
//         <div className="flex flex-col md:flex-row">
//           <div className="w-full md:w-1/5 space-y-4">
//             <h2 className="text-blue-600 font-bold text-lg">Appointment</h2>
//             <div className="bg-gray-100 rounded-lg p-4">
//               <h3 className="font-semibold mb-2">Appointment Calendar</h3>
//               {/* <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-700 mb-2">
//                 {days.map((d) => (
//                   <div key={d} className="font-medium">
//                     {d}
//                   </div>
//                 ))}
//                 {renderCalendarCells()}
//               </div> */}
//               {renderMiniCalendar()}
//             </div>
//             {renderTodaysSchedule()}
//             <div className="bg-gray-100 rounded-lg p-4 text-sm space-y-2">
//               <div className="flex items-center space-x-2">
//                 <span className="w-3 h-3 rounded-full bg-green-500"></span>
//                 <span>Accepted</span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
//                 <span>Pending</span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <span className="w-3 h-3 rounded-full bg-red-500"></span>
//                 <span>Rejected</span>
//               </div>
//             </div>
//             <div className="mt-4 flex justify-center">
//               <img src="/logo.png" alt="Senthuron Tech" className="h-8" />
//             </div>
//           </div>

//           <div className="w-full md:w-4/5 px-4">
//             <h1 className="text-2xl font-bold text-center mb-2">
//               Meeting Hall Booking
//             </h1>
//             <p className="text-center text-sm text-gray-600 mb-4">
//               {viewMode === "month"
//                 ? `${currentDate.toLocaleString("default", {
//                     month: "long",
//                   })} ${year}`
//                 : currentDate.toDateString()}
//             </p>

//             <div className="flex justify-between mb-2">
//               <div>
//                 <button
//                   className="px-2 py-1 bg-gray-200 rounded"
//                   onClick={() => setCurrentDate(new Date())}
//                 >
//                   Today
//                 </button>
//                 <button
//                   className="px-2 py-1 ml-2 bg-gray-200 rounded"
//                   onClick={() => changeMonth(-1)}
//                 >
//                   Back
//                 </button>
//                 <button
//                   className="px-2 py-1 ml-2 bg-gray-200 rounded"
//                   onClick={() => changeMonth(1)}
//                 >
//                   Next
//                 </button>
//               </div>
//               <div>
//                 {["month", "week", "day", "agenda"].map((m) => (
//                   <button
//                     key={m}
//                     className={`px-2 py-1 mr-1 rounded ${
//                       viewMode === m ? "bg-gray-300" : "bg-white border"
//                     }`}
//                     onClick={() => setViewMode(m)}
//                   >
//                     {m.charAt(0).toUpperCase() + m.slice(1)}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Month View Only */}
//             {/* {viewMode === "month" && (
//               <div className="grid grid-cols-7 border-t border-l text-sm">
//                 {days.map((d) => (
//                   <div
//                     key={d}
//                     className="border-b border-r p-2 font-semibold text-center"
//                   >
//                     {d}
//                   </div>
//                 ))}
//                 {renderCalendarCells()}
//               </div>
//             )} */}
//             {viewMode === "month" && (
//               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 border-t border-l text-sm">
//                 {days.map((d) => (
//                   <div
//                     key={d}
//                     className="border-b border-r p-2 font-semibold text-center bg-gray-100"
//                   >
//                     {d}
//                   </div>
//                 ))}
//                 {renderCalendarCells()}
//               </div>
//             )}
//             {viewMode === "week" && renderWeekView()}
//             {viewMode === "day" && renderDayView()}
//             {viewMode === "agenda" && renderAgendaView()}
//           </div>
//         </div>

//         {/* Modal Code */}
//         {/* {modalOpen && (
//           <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
//             <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
//               <h2 className="text-lg font-semibold mb-4">
//                 Book Room - {selectedDate?.toDateString()}
//               </h2>
//               <div className="space-y-3">
//                 <input
//                   name="name"
//                   value={formData.name}
//                   onChange={handleFormChange}
//                   placeholder="Name"
//                   className="w-full border px-3 py-1 rounded"
//                 />
//                 <input
//                   name="persons"
//                   type="number"
//                   value={formData.persons}
//                   onChange={handleFormChange}
//                   placeholder="Number of persons"
//                   className="w-full border px-3 py-1 rounded"
//                 />
//                 <input
//                   name="start"
//                   type="time"
//                   value={formData.start}
//                   onChange={handleFormChange}
//                   className="w-full border px-3 py-1 rounded"
//                 />
//                 <input
//                   name="end"
//                   type="time"
//                   value={formData.end}
//                   onChange={handleFormChange}
//                   className="w-full border px-3 py-1 rounded"
//                 />
//                 <input
//                   name="room"
//                   value={formData.room}
//                   readOnly
//                   className="w-full border px-3 py-1 rounded bg-gray-100"
//                 />
//                 <textarea
//                   name="reason"
//                   value={formData.reason}
//                   onChange={handleFormChange}
//                   placeholder="Reason for booking"
//                   className="w-full border px-3 py-1 rounded"
//                 />
//                 {warning && <p className="text-red-500 text-sm">{warning}</p>}
//                 <div className="flex justify-end gap-2">
//                   <button
//                     className="bg-gray-300 px-4 py-1 rounded"
//                     onClick={() => setModalOpen(false)}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     className="bg-blue-600 text-white px-4 py-1 rounded"
//                     onClick={handleSubmit}
//                   >
//                     Book
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )} */}
//         {/* {modalOpen && (
//           <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
//             <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
//               {formData.name === "_viewmore" ? (
//                 <>
//                   <h2 className="text-lg font-semibold mb-4">
//                     Bookings on {selectedDate?.toDateString()}
//                   </h2>
//                   <ul className="space-y-2 text-sm max-h-[400px] overflow-y-auto">
//                     {bookings
//                       .filter((b) => b.date === selectedDate?.toDateString())
//                       .map((b, i) => (
//                         <li key={i} className="border rounded p-2">
//                           <div>
//                             <strong>{b.name}</strong> ({b.room})
//                           </div>
//                           <div>
//                             {b.start} – {b.end}
//                           </div>
//                           {b.reason && (
//                             <div className="text-xs text-gray-500">
//                               {b.reason}
//                             </div>
//                           )}
//                         </li>
//                       ))}
//                   </ul>
//                   <div className="flex justify-end pt-4">
//                     <button
//                       className="bg-gray-300 px-4 py-1 rounded"
//                       onClick={() => setModalOpen(false)}
//                     >
//                       Close
//                     </button>
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   <h2 className="text-lg font-semibold mb-4">
//                     Book Room - {selectedDate?.toDateString()}
//                   </h2>
//                   <div className="space-y-3">
//                     <input
//                       name="name"
//                       value={formData.name}
//                       onChange={handleFormChange}
//                       placeholder="Name"
//                       className="w-full border px-3 py-1 rounded"
//                     />
//                     <input
//                       name="persons"
//                       type="number"
//                       value={formData.persons}
//                       onChange={handleFormChange}
//                       placeholder="Number of persons"
//                       className="w-full border px-3 py-1 rounded"
//                     />
//                     <input
//                       name="start"
//                       type="time"
//                       value={formData.start}
//                       onChange={handleFormChange}
//                       className="w-full border px-3 py-1 rounded"
//                     />
//                     <input
//                       name="end"
//                       type="time"
//                       value={formData.end}
//                       onChange={handleFormChange}
//                       className="w-full border px-3 py-1 rounded"
//                     />
//                     <input
//                       name="room"
//                       value={formData.room}
//                       readOnly
//                       className="w-full border px-3 py-1 rounded bg-gray-100"
//                     />
//                     <textarea
//                       name="reason"
//                       value={formData.reason}
//                       onChange={handleFormChange}
//                       placeholder="Reason for booking"
//                       className="w-full border px-3 py-1 rounded"
//                     />
//                     {warning && (
//                       <p className="text-red-500 text-sm">{warning}</p>
//                     )}
//                     <div className="flex justify-end gap-2">
//                       <button
//                         className="bg-gray-300 px-4 py-1 rounded"
//                         onClick={() => setModalOpen(false)}
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         className="bg-blue-600 text-white px-4 py-1 rounded"
//                         onClick={handleSubmit}
//                       >
//                         Book
//                       </button>
//                     </div>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         )} */}
//         {modalOpen && (
//   <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
//     <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
//       {formData.name === "_viewmore" ? (
//                 <>
//                   <h2 className="text-lg font-semibold mb-4">
//                     Bookings on {selectedDate?.toDateString()}
//                   </h2>
//                   <ul className="space-y-2 text-sm max-h-[400px] overflow-y-auto">
//                     {bookings
//                       .filter((b) => b.date === selectedDate?.toDateString())
//                       .map((b, i) => (
//                         <li key={i} className="border rounded p-2">
//                           <div>
//                             <strong>{b.name}</strong> ({b.room})
//                           </div>
//                           <div>
//                             {b.start} – {b.end}
//                           </div>
//                           {b.reason && (
//                             <div className="text-xs text-gray-500">
//                               {b.reason}
//                             </div>
//                           )}
//                         </li>
//                       ))}
//                   </ul>
//                   <div className="flex justify-end pt-4">
//                     <button
//                       className="bg-gray-300 px-4 py-1 rounded"
//                       onClick={() => setModalOpen(false)}
//                     >
//                       Close
//                     </button>
//                   </div>
//                 </>
//               )  : (
//         <>
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-lg font-semibold">
//               {editMode ? "Edit Booking" : "Book Room"} - {selectedDate?.toDateString()}
//             </h2>
//             {editingId && !editMode && (
//               <button
//                 className="text-sm text-blue-600 underline"
//                 onClick={() => setEditMode(true)}
//               >
//                 Edit
//               </button>
//             )}
//           </div>
//           <div className="space-y-3">
//             <input
//               name="name"
//               value={formData.name}
//               onChange={handleFormChange}
//               placeholder="Name"
//               className="w-full border px-3 py-1 rounded"
//               readOnly={!editMode}
//             />
//             <input
//               name="persons"
//               type="number"
//               value={formData.persons}
//               onChange={handleFormChange}
//               placeholder="Number of persons"
//               className="w-full border px-3 py-1 rounded"
//               readOnly={!editMode}
//             />
//             <input
//               name="start"
//               type="time"
//               value={formData.start}
//               onChange={handleFormChange}
//               className="w-full border px-3 py-1 rounded"
//               readOnly={!editMode}
//             />
//             <input
//               name="end"
//               type="time"
//               value={formData.end}
//               onChange={handleFormChange}
//               className="w-full border px-3 py-1 rounded"
//               readOnly={!editMode}
//             />
//             <input
//               name="room"
//               value={formData.room}
//               readOnly
//               className="w-full border px-3 py-1 rounded bg-gray-100"
//             />
//             <textarea
//               name="reason"
//               value={formData.reason}
//               onChange={handleFormChange}
//               placeholder="Reason for booking"
//               className="w-full border px-3 py-1 rounded"
//               readOnly={!editMode}
//             />
//             {warning && <p className="text-red-500 text-sm">{warning}</p>}
//             <div className="flex justify-end gap-2">
//               <button
//                 className="bg-gray-300 px-4 py-1 rounded"
//                 onClick={() => setModalOpen(false)}
//               >
//                 Cancel
//               </button>
//               {editMode && (
//                 <button
//                   className="bg-blue-600 text-white px-4 py-1 rounded"
//                   onClick={handleSubmit}
//                 >
//                   Save
//                 </button>
//               )}
//             </div>
//           </div>
//         </>

//       )}
//         </div>
//       </div>
//     )
//   }
//       </div>
//     </div>
//   );
// }
import { useState } from "react";
import { serverTimestamp } from "firebase/firestore";
import { db } from "../components/firebaseConfig"; // adjust the path if needed
import { collection, addDoc, getDocs, onSnapshot } from "firebase/firestore";

import { useEffect } from "react";

import { doc, updateDoc } from "firebase/firestore";
export default function MeetingHallBooking() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("month");
  const [bookings, setBookings] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

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
  useEffect(() => {
    const fetchBookings = async () => {
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
    };

    fetchBookings();
  }, []);
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "meetings"), (snapshot) => {
      const firebaseBookings = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Live bookings from Firebase:", firebaseBookings);
      setBookings(firebaseBookings);
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

  // const renderCalendarCells = () => {
  //   const cells = [];
  //   const today = new Date();
  //   today.setHours(0, 0, 0, 0);

  //   const totalSlots = startDay + daysInMonth;
  //   const totalRows = Math.ceil(totalSlots / 7);
  //   const totalCells = totalRows * 7;

  //   for (let i = 0; i < totalCells; i++) {
  //     const cellIndex = i - startDay + 1;
  //     const isInMonth = cellIndex >= 1 && cellIndex <= daysInMonth;

  //     if (!isInMonth) {
  //       cells.push(
  //         <div key={`empty-${i}`} className="border h-24 bg-white"></div>
  //       );
  //       continue;
  //     }

  //     const d = cellIndex;
  //     const date = new Date(year, month, d);
  //     date.setHours(0, 0, 0, 0);
  //     const dateStr = date.toDateString();
  //     const events = bookings.filter((b) => b.date === dateStr);
  //     const isToday = dateStr === todayStr;
  //     const isPast = date < today;
  //     const showAll =
  //       selectedDate?.toDateString() === dateStr &&
  //       modalOpen &&
  //       formData.name === "_viewmore";

  //     const handleClick = () => {
  //       if (!isPast) {
  //         setSelectedDate(date);
  //         setFormData({
  //           name: "",
  //           persons: "",
  //           start: "",
  //           end: "",
  //           room: "",
  //           reason: "",
  //         });
  //         setWarning("");
  //         setModalOpen(true);
  //       }
  //     };

  //     cells.push(
  //       <div
  //         key={d}
  //         onClick={handleClick}
  //         className={`border h-24 p-2 relative transition duration-150 ease-in-out cursor-${
  //           isPast ? "not-allowed" : "pointer"
  //         } ${
  //           isPast
  //             ? "bg-gray-100 text-gray-400"
  //             : isToday
  //             ? "bg-blue-100"
  //             : "bg-white hover:bg-blue-50"
  //         }`}
  //       >
  //         <div className="text-right text-xs font-semibold text-gray-600">
  //           {d}
  //         </div>
  //         <div className="absolute top-5 left-1 right-1">
  //           {events.slice(0, 3).map((b, i) => (
  //             <div
  //               key={i}
  //               className="bg-blue-600 text-white text-[11px] px-1 py-0.5 rounded mb-1 overflow-hidden whitespace-nowrap truncate"
  //             >
  //               {b.name} ({b.room})
  //             </div>
  //           ))}
  //           {events.length > 3 && (
  //             <div
  //               className="text-blue-600 text-xs underline cursor-pointer"
  //               onClick={(e) => {
  //                 e.stopPropagation();
  //                 setSelectedDate(date);
  //                 setFormData({
  //                   name: "_viewmore",
  //                   persons: "",
  //                   start: "",
  //                   end: "",
  //                   room: "",
  //                   reason: "",
  //                 });
  //                 setModalOpen(true);
  //               }}
  //             >
  //               +{events.length - 3} more
  //             </div>
  //           )}
  //         </div>
  //       </div>
  //     );
  //   }
  //   return cells;
  // };
  const renderCalendarCells = () => {
    const cells = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalSlots = startDay + daysInMonth;
    const totalRows = Math.ceil(totalSlots / 7);
    const totalCells = totalRows * 7;

    for (let i = 0; i < totalCells; i++) {
      const cellIndex = i - startDay + 1;
      const isInMonth = cellIndex >= 1 && cellIndex <= daysInMonth;

      if (!isInMonth) {
        cells.push(
          <div key={`empty-${i}`} className="border h-24 bg-white"></div>
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
          setSelectedBooking(null); // it's a fresh booking
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
          className={`border h-24 p-2 relative transition duration-150 ease-in-out cursor-${
            isPast ? "not-allowed" : "pointer"
          } ${
            isPast
              ? "bg-gray-100 text-gray-400"
              : isToday
              ? "bg-blue-100"
              : "bg-white hover:bg-blue-50"
          }`}
        >
          <div className="text-right text-xs font-semibold text-gray-600">
            {d}
          </div>
          <div className="absolute top-5 left-1 right-1">
            {events.slice(0, 3).map((b, i) => (
              <div
                key={i}
                className="bg-blue-600 text-white text-[11px] px-1 py-0.5 rounded mb-1 overflow-hidden whitespace-nowrap truncate cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedDate(date);
                  setSelectedBooking(b); // editing existing
                  setFormData(b); // pre-fill form
                  setIsEditing(false); // view mode first
                  setWarning("");
                  setModalOpen(true);
                }}
              >
                {b.name} ({b.room})
              </div>
            ))}
            {events.length > 3 && (
              <div
                className="text-blue-600 text-xs underline cursor-pointer"
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

  // Updated handleSubmit to save booking in Firestore
  // const handleSubmit = async () => {
  //   const selectedDateStr = selectedDate.toDateString();
  //   const newBooking = { date: selectedDateStr, ...formData };
  //   try {
  //     await addDoc(collection(db, "meetings"), newBooking);
  //     setBookings([...bookings, newBooking]);
  //     setFormData({
  //       name: "",
  //       persons: "",
  //       start: "",
  //       end: "",
  //       room: "",
  //       reason: "",
  //     });
  //     setModalOpen(false);
  //     setWarning("");
  //   } catch (error) {
  //     console.error("Error saving to Firestore:", error);
  //     setWarning("Failed to save booking. Please try again.");
  //   }
  // };
  const handleSubmit = async () => {
    const selectedDateStr = selectedDate.toDateString();

    const nextId =
      bookings.length > 0
        ? Math.max(...bookings.map((b) => parseInt(b.userId || 0))) + 1
        : 1;

    const newBooking = {
      date: selectedDateStr,
      ...formData,
      status: "pending",
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
                <li key={i} className="text-gray-700">
                  <strong>{b.name}</strong> - {formatTime12Hour(b.start)} to{" "}
                  {formatTime12Hour(b.end)} ({b.room})
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
            <div key={idx} className="border rounded p-2 bg-white shadow-sm">
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
      <div className="bg-white border rounded p-4 shadow-sm">
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
      <div className="bg-white border rounded p-4 shadow-sm text-sm">
        <h3 className="font-semibold text-gray-700 mb-2">Agenda View</h3>
        {sortedBookings.length > 0 ? (
          <ul className="space-y-2">
            {sortedBookings.map((b, i) => (
              <li key={i} className="border-b pb-2">
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

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="min-h-screen bg-white p-4">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/5 space-y-4">
            <h2 className="text-blue-600 font-bold text-lg">Appointment</h2>
            <div className="bg-gray-100 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Appointment Calendar</h3>
              {/* <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-700 mb-2">
                {days.map((d) => (
                  <div key={d} className="font-medium">
                    {d}
                  </div>
                ))}
                {renderCalendarCells()}
              </div> */}
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
            <div className="mt-4 flex justify-center">
              <img src="/logo.png" alt="Senthuron Tech" className="h-8" />
            </div>
          </div>

          <div className="w-full md:w-4/5 px-4">
            <h1 className="text-2xl font-bold text-center mb-2">
              Meeting Hall Booking
            </h1>
            <p className="text-center text-sm text-gray-600 mb-4">
              {viewMode === "month"
                ? `${currentDate.toLocaleString("default", {
                    month: "long",
                  })} ${year}`
                : currentDate.toDateString()}
            </p>

            <div className="flex justify-between mb-2">
              <div>
                <button
                  className="px-2 py-1 bg-gray-200 rounded"
                  onClick={() => setCurrentDate(new Date())}
                >
                  Today
                </button>
                <button
                  className="px-2 py-1 ml-2 bg-gray-200 rounded"
                  onClick={() => changeMonth(-1)}
                >
                  Back
                </button>
                <button
                  className="px-2 py-1 ml-2 bg-gray-200 rounded"
                  onClick={() => changeMonth(1)}
                >
                  Next
                </button>
              </div>
              <div>
                {["month", "week", "day", "agenda"].map((m) => (
                  <button
                    key={m}
                    className={`px-2 py-1 mr-1 rounded ${
                      viewMode === m ? "bg-gray-300" : "bg-white border"
                    }`}
                    onClick={() => setViewMode(m)}
                  >
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Month View Only */}
            {/* {viewMode === "month" && (
              <div className="grid grid-cols-7 border-t border-l text-sm">
                {days.map((d) => (
                  <div
                    key={d}
                    className="border-b border-r p-2 font-semibold text-center"
                  >
                    {d}
                  </div>
                ))}
                {renderCalendarCells()}
              </div>
            )} */}
            {viewMode === "month" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 border-t border-l text-sm">
                {days.map((d) => (
                  <div
                    key={d}
                    className="border-b border-r p-2 font-semibold text-center bg-gray-100"
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
          </div>
        </div>

        {/* Modal Code */}
        {/* {modalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-lg font-semibold mb-4">
                Book Room - {selectedDate?.toDateString()}
              </h2>
              <div className="space-y-3">
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Name"
                  className="w-full border px-3 py-1 rounded"
                />
                <input
                  name="persons"
                  type="number"
                  value={formData.persons}
                  onChange={handleFormChange}
                  placeholder="Number of persons"
                  className="w-full border px-3 py-1 rounded"
                />
                <input
                  name="start"
                  type="time"
                  value={formData.start}
                  onChange={handleFormChange}
                  className="w-full border px-3 py-1 rounded"
                />
                <input
                  name="end"
                  type="time"
                  value={formData.end}
                  onChange={handleFormChange}
                  className="w-full border px-3 py-1 rounded"
                />
                <input
                  name="room"
                  value={formData.room}
                  readOnly
                  className="w-full border px-3 py-1 rounded bg-gray-100"
                />
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleFormChange}
                  placeholder="Reason for booking"
                  className="w-full border px-3 py-1 rounded"
                />
                {warning && <p className="text-red-500 text-sm">{warning}</p>}
                <div className="flex justify-end gap-2">
                  <button
                    className="bg-gray-300 px-4 py-1 rounded"
                    onClick={() => setModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-blue-600 text-white px-4 py-1 rounded"
                    onClick={handleSubmit}
                  >
                    Book
                  </button>
                </div>
              </div>
            </div>
          </div>
        )} */}
        {/* {modalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              {formData.name === "_viewmore" ? (
                <>
                  <h2 className="text-lg font-semibold mb-4">
                    Bookings on {selectedDate?.toDateString()}
                  </h2>
                  <ul className="space-y-2 text-sm max-h-[400px] overflow-y-auto">
                    {bookings
                      .filter((b) => b.date === selectedDate?.toDateString())
                      .map((b, i) => (
                        <li key={i} className="border rounded p-2">
                          <div>
                            <strong>{b.name}</strong> ({b.room})
                          </div>
                          <div>
                            {b.start} – {b.end}
                          </div>
                          {b.reason && (
                            <div className="text-xs text-gray-500">
                              {b.reason}
                            </div>
                          )}
                        </li>
                      ))}
                  </ul>
                  <div className="flex justify-end pt-4">
                    <button
                      className="bg-gray-300 px-4 py-1 rounded"
                      onClick={() => setModalOpen(false)}
                    >
                      Close
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-lg font-semibold mb-4">
                    Book Room - {selectedDate?.toDateString()}
                  </h2>
                  <div className="space-y-3">
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      placeholder="Name"
                      className="w-full border px-3 py-1 rounded"
                    />
                    <input
                      name="persons"
                      type="number"
                      value={formData.persons}
                      onChange={handleFormChange}
                      placeholder="Number of persons"
                      className="w-full border px-3 py-1 rounded"
                    />
                    <input
                      name="start"
                      type="time"
                      value={formData.start}
                      onChange={handleFormChange}
                      className="w-full border px-3 py-1 rounded"
                    />
                    <input
                      name="end"
                      type="time"
                      value={formData.end}
                      onChange={handleFormChange}
                      className="w-full border px-3 py-1 rounded"
                    />
                    <input
                      name="room"
                      value={formData.room}
                      readOnly
                      className="w-full border px-3 py-1 rounded bg-gray-100"
                    />
                    <textarea
                      name="reason"
                      value={formData.reason}
                      onChange={handleFormChange}
                      placeholder="Reason for booking"
                      className="w-full border px-3 py-1 rounded"
                    />
                    {warning && (
                      <p className="text-red-500 text-sm">{warning}</p>
                    )}
                    <div className="flex justify-end gap-2">
                      <button
                        className="bg-gray-300 px-4 py-1 rounded"
                        onClick={() => setModalOpen(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="bg-blue-600 text-white px-4 py-1 rounded"
                        onClick={handleSubmit}
                      >
                        Book
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )} */}
        {modalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
              {/* Top Right Edit/Save Button */}
              {selectedBooking && (
                <div className="absolute top-4 right-4 space-x-2">
                  {!isEditing ? (
                    <button
                      className="text-sm text-blue-600 underline"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit
                    </button>
                  ) : (
                    <button
                      className="text-sm text-green-600 underline"
                      onClick={handleUpdate}
                    >
                      Save Changes
                    </button>
                  )}
                </div>
              )}

              {/* Modal Heading */}
              <h2 className="text-lg font-semibold mb-4">
                {selectedBooking
                  ? isEditing
                    ? `Editing Booking - ${selectedDate?.toDateString()}`
                    : `Booking Details - ${selectedDate?.toDateString()}`
                  : `Book Room - ${selectedDate?.toDateString()}`}
              </h2>

              {/* View Mode for Existing Booking */}
              {selectedBooking && !isEditing ? (
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Name:</strong> {formData.name}
                  </p>
                  <p>
                    <strong>Persons:</strong> {formData.persons}
                  </p>
                  <p>
                    <strong>Time:</strong> {formData.start} – {formData.end}
                  </p>
                  <p>
                    <strong>Room:</strong> {formData.room}
                  </p>
                  {formData.reason && (
                    <p>
                      <strong>Reason:</strong> {formData.reason}
                    </p>
                  )}
                </div>
              ) : (
                // Editable Form (for new or editing)
                <div className="space-y-3">
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="Name"
                    className="w-full border px-3 py-1 rounded"
                  />
                  <input
                    name="persons"
                    type="number"
                    value={formData.persons}
                    onChange={handleFormChange}
                    placeholder="Number of persons"
                    className="w-full border px-3 py-1 rounded"
                  />
                  <input
                    name="start"
                    type="time"
                    value={formData.start}
                    onChange={handleFormChange}
                    className="w-full border px-3 py-1 rounded"
                  />
                  <input
                    name="end"
                    type="time"
                    value={formData.end}
                    onChange={handleFormChange}
                    className="w-full border px-3 py-1 rounded"
                  />
                  <input
                    name="room"
                    value={formData.room}
                    readOnly
                    className="w-full border px-3 py-1 rounded bg-gray-100"
                  />
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleFormChange}
                    placeholder="Reason for booking"
                    className="w-full border px-3 py-1 rounded"
                  />
                </div>
              )}

              {/* Warning */}
              {warning && (
                <p className="text-red-500 text-sm mt-2">{warning}</p>
              )}

              {/* Footer Buttons */}
              <div className="flex justify-end gap-2 mt-6">
                <button
                  className="bg-gray-300 px-4 py-1 rounded"
                  onClick={() => {
                    setModalOpen(false);
                    setSelectedBooking(null);
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </button>
                {!selectedBooking && (
                  <button
                    className="bg-blue-600 text-white px-4 py-1 rounded"
                    onClick={handleSubmit}
                  >
                    Book
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
