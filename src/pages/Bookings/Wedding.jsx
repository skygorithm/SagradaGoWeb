import { useContext, useState } from "react";
import { NavbarContext } from "../../context/AllContext";
import "../../styles/booking/wedding.css";
import default_profile from "../../assets/no-image.jpg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Wedding() {
  const { currentUser } = useContext(NavbarContext);

  console.log(currentUser);

  const [form, setForm] = useState({
    uid: currentUser.uid,
    date: "",
    time: "",
    attendees: "",
    contact_number: "",
    groom_fullname: "",
    bride_fullname: "",
    marriage_license: null,
    marriage_contract: null,
    groom_1x1: null,
    bride_1x1: null,
    groom_baptismal_cert: null,
    bride_baptismal_cert: null,
    groom_confirmation_cert: null,
    bride_confirmation_cert: null,
    groom_cenomar: null,
    bride_cenomar: null,
    groom_banns: null,
    bride_banns: null,
    groom_permission: null,
    bride_permission: null,
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [serverError, setServerError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleFileChange(e) {
    const { name, files } = e.target;
    setForm((s) => ({ ...s, [name]: files?.[0] ?? null }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function validate() {
    const err = {};
    if (!form.uid) err.uid = "User ID is required";
    if (!form.date) err.date = "Wedding date is required";
    if (!form.time) err.time = "Wedding time is required";
    if (!form.attendees || Number(form.attendees) <= 0)
      err.attendees = "Valid number of attendees is required";
    if (!form.contact_number) err.contact_number = "Contact number is required";
    if (!form.groom_fullname)
      err.groom_fullname = "Groom full name is required";
    if (!form.bride_fullname)
      err.bride_fullname = "Bride full name is required";
    if (!form.groom_1x1) err.groom_1x1 = "Groom 1x1 photo is required";
    if (!form.bride_1x1) err.bride_1x1 = "Bride 1x1 photo is required";
    if (!form.marriage_license && !form.marriage_contract)
      err.marriage = "Marriage license or contract is required";
    if (!form.groom_baptismal_cert)
      err.groom_baptismal_cert = "Groom baptismal certificate is required";
    if (!form.bride_baptismal_cert)
      err.bride_baptismal_cert = "Bride baptismal certificate is required";
    if (!form.groom_confirmation_cert)
      err.groom_confirmation_cert =
        "Groom confirmation certificate is required";
    if (!form.bride_confirmation_cert)
      err.bride_confirmation_cert =
        "Bride confirmation certificate is required";

    return err;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSuccessMsg("");
    setServerError("");

    const err = validate();
    if (Object.keys(err).length) {
      setErrors(err);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSubmitting(true);

    try {
      const fd = new FormData();
      [
        "uid",
        "date",
        "time",
        "attendees",
        "contact_number",
        "groom_fullname",
        "bride_fullname",
      ].forEach((k) => fd.append(k, form[k] ?? ""));

      // append files (only if present)
      const filesToAppend = [
        "marriage_license",
        "marriage_contract",
        "groom_1x1",
        "bride_1x1",
        "groom_baptismal_cert",
        "bride_baptismal_cert",
        "groom_confirmation_cert",
        "bride_confirmation_cert",
        "groom_cenomar",
        "bride_cenomar",
        "groom_banns",
        "bride_banns",
        "groom_permission",
        "bride_permission",
      ];

      filesToAppend.forEach((k) => {
        if (form[k]) fd.append(k, form[k]);
      });

      const res = await fetch(apiEndpoint, {
        method: "POST",
        body: fd,
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.message || "Server returned an error");
      } else {
        setSuccessMsg(data.message || "Wedding booking created");
        // reset form (optional)
        setForm({
          uid: "",
          date: "",
          time: "",
          attendees: "",
          contact_number: "",
          groom_fullname: "",
          bride_fullname: "",
          marriage_license: null,
          marriage_contract: null,
          groom_1x1: null,
          bride_1x1: null,
          groom_baptismal_cert: null,
          bride_baptismal_cert: null,
          groom_confirmation_cert: null,
          bride_confirmation_cert: null,
          groom_cenomar: null,
          bride_cenomar: null,
          groom_banns: null,
          bride_banns: null,
          groom_permission: null,
          bride_permission: null,
        });
      }
    } catch (err) {
      console.error(err);
      setServerError("Network or server error");
    } finally {
      setSubmitting(false);
    }
  }

  // small helper to render a file name or placeholder
  function fileLabel(file) {
    return file ? file.name : "No file chosen";
  }

  const inputText = [
    {
      title: "Groom First Name",
      type: "text",
    },
    {
      title: "Groom Middle Name",
      type: "text",
    },
    {
      title: "Groom Last Name",
      type: "text",
    },
    {
      title: "Date",
      type: "date",
    },
    {
      title: "Bride First Name",
      type: "text",
    },
    {
      title: "Bride Middle Name",
      type: "text",
    },
    {
      title: "Bride Last Name",
      type: "text",
    },
    {
      title: "Time",
      type: "time",
    },
    {
      title: "Contact Number",
      type: "text",
    },
    {
      title: "Attendees",
      type: "number",
    },
  ];

  const uploadProfileImage = [
    {
      title: "Groom Photo",
    },
    {
      title: "Bride Photo",
    },
  ];

  return (
    <form className="w-full bg-green-400 grid grid-cols-4 p-10! gap-4">

      {
  inputText.map((elem) => (
    <div className="flex flex-col" key={elem.title}>
      <h1>{elem.title}</h1>

      {elem.type === "date" ? (
        <DatePicker
          selected={form.date}
          onChange={(v) => setForm({ ...form, date: v })}
          className="input-text"
          dateFormat="yyyy-MM-dd"
        />
      ) : elem.type === "time" ? (
        <DatePicker
          selected={form.time}
          onChange={(v) => setForm({ ...form, time: v })}
          className="input-text"
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          timeCaption="Time"
          dateFormat="h:mm aa"
        />
      ) : (
        <input type={elem.type} className="input-text" />
      )}
    </div>
  ))
}



      {uploadProfileImage.map((elem) => (
        <div className="grid grid-cols-[3fr_1fr] w-full">
          <div>
            <label className="block text-sm font-medium mb-1">
              {elem.title}
            </label>
            <input
              type="file"
              accept="image/*"
              name="groom_1x1"
              onChange={handleFileChange}
            />
            <p className="text-xs mt-1">{fileLabel(form.groom_1x1)}</p>
            {errors.groom_1x1 && (
              <p className="text-xs text-red-500 mt-1">{errors.groom_1x1}</p>
            )}
          </div>
          <img src={default_profile} alt="no-profile" className="w-15" />
        </div>
      ))}
    </form>

    // <form onSubmit={handleSubmit} className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-sm">
    //   <h2 className="text-2xl font-semibold mb-4">Wedding Booking</h2>

    //   {Object.keys(errors).length > 0 && (
    //     <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded">
    //       Please fix the highlighted fields below.
    //     </div>
    //   )}

    //   {serverError && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded">{serverError}</div>}
    //   {successMsg && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded">{successMsg}</div>}

    //   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

    //     <div>
    //       <label className="block text-sm font-medium mb-1">Contact Number</label>
    //       <input name="contact_number" value={form.contact_number} onChange={handleChange} className={`w-full px-3 py-2 border rounded ${errors.contact_number ? 'border-red-500' : 'border-gray-300'}`} />
    //       {errors.contact_number && <p className="text-xs text-red-500 mt-1">{errors.contact_number}</p>}
    //     </div>

    //     <div>
    //       <label className="block text-sm font-medium mb-1">Wedding Date</label>
    //       <input type="date" name="date" value={form.date} onChange={handleChange} className={`w-full px-3 py-2 border rounded ${errors.date ? 'border-red-500' : 'border-gray-300'}`} />
    //       {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
    //     </div>

    //     <div>
    //       <label className="block text-sm font-medium mb-1">Wedding Time</label>
    //       <input type="time" name="time" value={form.time} onChange={handleChange} className={`w-full px-3 py-2 border rounded ${errors.time ? 'border-red-500' : 'border-gray-300'}`} />
    //       {errors.time && <p className="text-xs text-red-500 mt-1">{errors.time}</p>}
    //     </div>

    //     <div>
    //       <label className="block text-sm font-medium mb-1">Number of Attendees</label>
    //       <input type="number" min="1" name="attendees" value={form.attendees} onChange={handleChange} className={`w-full px-3 py-2 border rounded ${errors.attendees ? 'border-red-500' : 'border-gray-300'}`} />
    //       {errors.attendees && <p className="text-xs text-red-500 mt-1">{errors.attendees}</p>}
    //     </div>

    //     <div></div>

    //     <div className="md:col-span-1">
    //       <label className="block text-sm font-medium mb-1">Groom Fullname</label>
    //       <input name="groom_fullname" value={form.groom_fullname} onChange={handleChange} className={`w-full px-3 py-2 border rounded ${errors.groom_fullname ? 'border-red-500' : 'border-gray-300'}`} />
    //       {errors.groom_fullname && <p className="text-xs text-red-500 mt-1">{errors.groom_fullname}</p>}
    //     </div>

    //     <div className="md:col-span-1">
    //       <label className="block text-sm font-medium mb-1">Bride Fullname</label>
    //       <input name="bride_fullname" value={form.bride_fullname} onChange={handleChange} className={`w-full px-3 py-2 border rounded ${errors.bride_fullname ? 'border-red-500' : 'border-gray-300'}`} />
    //       {errors.bride_fullname && <p className="text-xs text-red-500 mt-1">{errors.bride_fullname}</p>}
    //     </div>
    //   </div>

    //   <hr className="my-6" />

    //   <h3 className="text-lg font-medium mb-3">Photos & Core Documents</h3>

    //   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    //     <div>
    //       <label className="block text-sm font-medium mb-1">Groom 1x1 Photo</label>
    //       <input type="file" accept="image/*" name="groom_1x1" onChange={handleFileChange} />
    //       <p className="text-xs mt-1">{fileLabel(form.groom_1x1)}</p>
    //       {errors.groom_1x1 && <p className="text-xs text-red-500 mt-1">{errors.groom_1x1}</p>}
    //     </div>

    //     <div>
    //       <label className="block text-sm font-medium mb-1">Bride 1x1 Photo</label>
    //       <input type="file" accept="image/*" name="bride_1x1" onChange={handleFileChange} />
    //       <p className="text-xs mt-1">{fileLabel(form.bride_1x1)}</p>
    //       {errors.bride_1x1 && <p className="text-xs text-red-500 mt-1">{errors.bride_1x1}</p>}
    //     </div>

    //     <div>
    //       <label className="block text-sm font-medium mb-1">Marriage License (optional if contract provided)</label>
    //       <input type="file" name="marriage_license" onChange={handleFileChange} />
    //       <p className="text-xs mt-1">{fileLabel(form.marriage_license)}</p>
    //     </div>

    //     <div>
    //       <label className="block text-sm font-medium mb-1">Marriage Contract</label>
    //       <input type="file" name="marriage_contract" onChange={handleFileChange} />
    //       <p className="text-xs mt-1">{fileLabel(form.marriage_contract)}</p>
    //     </div>
    //   </div>

    //   <hr className="my-6" />

    //   <h3 className="text-lg font-medium mb-3">Certificates & Additional Documents</h3>

    //   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    //     <div>
    //       <label className="block text-sm font-medium mb-1">Groom Baptismal Certificate</label>
    //       <input type="file" name="groom_baptismal_cert" onChange={handleFileChange} />
    //       <p className="text-xs mt-1">{fileLabel(form.groom_baptismal_cert)}</p>
    //       {errors.groom_baptismal_cert && <p className="text-xs text-red-500 mt-1">{errors.groom_baptismal_cert}</p>}
    //     </div>

    //     <div>
    //       <label className="block text-sm font-medium mb-1">Bride Baptismal Certificate</label>
    //       <input type="file" name="bride_baptismal_cert" onChange={handleFileChange} />
    //       <p className="text-xs mt-1">{fileLabel(form.bride_baptismal_cert)}</p>
    //       {errors.bride_baptismal_cert && <p className="text-xs text-red-500 mt-1">{errors.bride_baptismal_cert}</p>}
    //     </div>

    //     <div>
    //       <label className="block text-sm font-medium mb-1">Groom Confirmation Certificate</label>
    //       <input type="file" name="groom_confirmation_cert" onChange={handleFileChange} />
    //       <p className="text-xs mt-1">{fileLabel(form.groom_confirmation_cert)}</p>
    //       {errors.groom_confirmation_cert && <p className="text-xs text-red-500 mt-1">{errors.groom_confirmation_cert}</p>}
    //     </div>

    //     <div>
    //       <label className="block text-sm font-medium mb-1">Bride Confirmation Certificate</label>
    //       <input type="file" name="bride_confirmation_cert" onChange={handleFileChange} />
    //       <p className="text-xs mt-1">{fileLabel(form.bride_confirmation_cert)}</p>
    //       {errors.bride_confirmation_cert && <p className="text-xs text-red-500 mt-1">{errors.bride_confirmation_cert}</p>}
    //     </div>

    //     <div>
    //       <label className="block text-sm font-medium mb-1">Groom CENOMAR (optional)</label>
    //       <input type="file" name="groom_cenomar" onChange={handleFileChange} />
    //       <p className="text-xs mt-1">{fileLabel(form.groom_cenomar)}</p>
    //     </div>

    //     <div>
    //       <label className="block text-sm font-medium mb-1">Bride CENOMAR (optional)</label>
    //       <input type="file" name="bride_cenomar" onChange={handleFileChange} />
    //       <p className="text-xs mt-1">{fileLabel(form.bride_cenomar)}</p>
    //     </div>

    //     <div>
    //       <label className="block text-sm font-medium mb-1">Groom Banns / Permission</label>
    //       <input type="file" name="groom_banns" onChange={handleFileChange} />
    //       <p className="text-xs mt-1">{fileLabel(form.groom_banns)}</p>
    //     </div>

    //     <div>
    //       <label className="block text-sm font-medium mb-1">Bride Banns / Permission</label>
    //       <input type="file" name="bride_banns" onChange={handleFileChange} />
    //       <p className="text-xs mt-1">{fileLabel(form.bride_banns)}</p>
    //     </div>

    //     <div>
    //       <label className="block text-sm font-medium mb-1">Groom Permission (if applicable)</label>
    //       <input type="file" name="groom_permission" onChange={handleFileChange} />
    //       <p className="text-xs mt-1">{fileLabel(form.groom_permission)}</p>
    //     </div>

    //     <div>
    //       <label className="block text-sm font-medium mb-1">Bride Permission (if applicable)</label>
    //       <input type="file" name="bride_permission" onChange={handleFileChange} />
    //       <p className="text-xs mt-1">{fileLabel(form.bride_permission)}</p>
    //     </div>
    //   </div>

    //   <div className="mt-6 flex items-center gap-3">
    //     <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
    //       {submitting ? "Submitting..." : "Create Booking"}
    //     </button>

    //     <button type="button" onClick={() => {
    //       setForm({
    //         uid: "",
    //         date: "",
    //         time: "",
    //         attendees: "",
    //         contact_number: "",
    //         groom_fullname: "",
    //         bride_fullname: "",
    //         marriage_license: null,
    //         marriage_contract: null,
    //         groom_1x1: null,
    //         bride_1x1: null,
    //         groom_baptismal_cert: null,
    //         bride_baptismal_cert: null,
    //         groom_confirmation_cert: null,
    //         bride_confirmation_cert: null,
    //         groom_cenomar: null,
    //         bride_cenomar: null,
    //         groom_banns: null,
    //         bride_banns: null,
    //         groom_permission: null,
    //         bride_permission: null,
    //       });
    //       setErrors({});
    //       setServerError("");
    //       setSuccessMsg("");
    //     }} className="px-4 py-2 border rounded">Reset</button>
    //   </div>

    // </form>
  );
}
