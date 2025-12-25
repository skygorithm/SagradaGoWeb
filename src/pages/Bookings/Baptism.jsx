import { useContext, useEffect, useState } from "react";
import { NavbarContext } from "../../context/AllContext";
import "../../styles/booking/wedding.css";
import default_profile from "../../assets/no-image.jpg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import no_image from "../../assets/blank-image.jpg";
import { supabase } from "../../config/supabase";
import axios from "axios";
import { API_URL } from "../../Constants";

export default function Baptism() {
  const { currentUser, bookingSelected, setBookingSelected } = useContext(NavbarContext);

  // TO BE DELETE
  const occupiedDates = [
    new Date("2025-11-27"),
    new Date("2025-11-28"),
    new Date("2025-11-29"),
    new Date("2025-11-30"),
    new Date("2025-12-04"),
  ];

  //-------------------

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
    const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [candidateFname, setCandidateFname] = useState("");
  const [candidateMname, setCandidateMname] = useState("");
  const [candidateLname, setCandidateLname] = useState("");
  const [candidateBday, setCandidateBday] = useState("");
    const [candidateBplace, setCandidateBplace] = useState("");

  const [contact, setContact] = useState("");
  const [attendees, setAttendees] = useState(0);

  const inputText = [
    {
      key: "fullname",
      title: "Requester Full Name",
      type: "text",
      onChange: setFullname,
      value: fullname,
    },
    {
      key: "email",
      title: "Requester Email",
      type: "email",
      onChange: setEmail,
      value: email,
    },
    {
      key: "time",
      title: "Time",
      type: "time",
      onChange: setTime,
      value: time,
    },
    { 
        key: "date", 
        title: "Date", 
        type: "date", 
        onChange: setDate 
    },
    {
      key: "candidate_fname",
      title: "Candidate First Name",
      type: "text",
      onChange: setCandidateFname,
      value: candidateFname,
    },
    

    {
      key: "candidate_mname",
      title: "Candidate Middle Name",
      type: "text",
      onChange: setCandidateMname,
      value: candidateMname,
    },
    {
      key: "candidate_lname",
      title: "Candidate Last Name",
      type: "text",
      onChange: setCandidateLname,
      value: candidateLname,
    },
    { 
        key: "date", 
        title: "Candidate Birth Date", 
        type: "date", 
        onChange: setCandidateBday ,
        value: candidateBday
    },
    {
      key: "candidate_bplace",
      title: "Candidate Birth Place",
      type: "text",
      onChange: setCandidateBplace,
      value: candidateBplace,
    },

    {
      key: "contact_number",
      title: "Contact Number",
      type: "text",
      onChange: setContact,
      value: contact,
    },
    {
      key: "attendees",
      title: "Attendees",
      type: "number",
      onChange: setAttendees,
      value: attendees,
    },
  ];

  const [groomFile, setGroomFile] = useState(null);
  const [brideFile, setBrideFile] = useState(null);

  const [groomPreview, setGroomPreview] = useState("");
  const [bridePreview, setBridePreview] = useState("");

  const [groomPhoto, setGroomPhoto] = useState("");
  const [bridePhoto, setBridePhoto] = useState("");

  async function uploadImage(file, namePrefix) {
    const ext = file.name.split(".").pop();
    const fileName = `${namePrefix}_${Date.now()}.${ext}`;
    const filePath = `wedding/${fileName}`;

    const { error } = await supabase.storage
      .from("wedding")
      .upload(filePath, file, { upsert: true });

    if (error) {
      console.error("Upload Error:", error);
      throw error;
    }

    const { data } = supabase.storage.from("wedding").getPublicUrl(filePath);
    return data.publicUrl;
  }

  

//   function generateTransactionID() {
//     const random = Math.random().toString(36).substring(2, 8).toUpperCase();
//     const timestamp = Date.now().toString().slice(-6); // last 6 digits of timestamp
//     return `TX-${timestamp}-${random}`;
//   }


  return (
    <div className="main-holder">
      <div className="form-container">
        {inputText.map((elem) => (
          <div className="flex flex-col" key={elem.key}>
            <h1>{elem.title}</h1>

            {elem.type === "date" ? (
              <>
                <DatePicker
                  selected={date ? new Date(date) : null}
                  onChange={(v) => setDate(v ? v.toISOString() : "")}
                  className="input-text"
                  dateFormat="yyyy-MM-dd"
                  excludeDates={occupiedDates}
                />
              </>
            ) : elem.type === "time" ? (
              <div className="time-container">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <MobileTimePicker
                    value={time ? dayjs(`2000-01-01 ${time}`) : null}
                    onChange={(v) => {
                      setTime(v ? dayjs(v).format("HH:mm") : "");
                    }}
                    slotProps={{
                      textField: {
                        className: "time-slot-props",
                        InputProps: {
                          sx: {
                            padding: 0,
                            height: "100%",
                            "& fieldset": { border: "none" },
                          },
                        },
                        sx: {
                          padding: 0,
                          margin: 0,
                          height: "100%",
                          "& .MuiInputBase-root": {
                            height: "100%",
                            padding: 0,
                          },
                          "& .MuiInputBase-input": {
                            height: "100%",
                            padding: 0,
                          },
                        },
                      },
                    }}
                  />
                </LocalizationProvider>
              </div>
            ) : (
              <>
                <input
                  name={elem.key}
                  type={elem.type}
                  className="input-text"
                  onChange={(e) => elem.onChange(e.target.value)}
                  value={elem.value}
                />
              </>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}
