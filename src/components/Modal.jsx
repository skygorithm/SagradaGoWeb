// import { Modal as AntModal } from "antd";

// export default function Modal({ message, setShowModal, onOk, bookComplete }) {
//   const handleClose = () => {
//     setShowModal(false);
//   };

//   return (
//     <AntModal
//       open={true}
//       title="Notice"
//       onOk={bookComplete ? onOk : handleClose}
//       onCancel={handleClose}
//       centered
//       okButtonProps={{ className: "bg-blue-500" }}
//     >
//       <div className="py-4">
//         <p className="text-base text-gray-700">{message}</p>
//       </div>
//     </AntModal>
//   );
// }

import { Modal as AntModal } from "antd";

export default function Modal({ message, setShowModal, onOk, bookComplete, hideCancel = false }) {
  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <AntModal
      open={true}
      title="Notice"
      onOk={bookComplete ? onOk : handleClose}
      onCancel={hideCancel ? undefined : handleClose} 
      centered
      okButtonProps={{ className: "bg-blue-500" }}
      cancelButtonProps={hideCancel ? { style: { display: "none" } } : {}}
    >
      <div className="py-4">
        <p className="text-base text-gray-700">{message}</p>
      </div>
    </AntModal>
  );
}
