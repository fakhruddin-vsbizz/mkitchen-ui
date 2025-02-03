import { Modal } from "antd";
const AsyncModal = (props) => {
  const handleCancel = () => {
    console.log("Clicked cancel button");
    props.setOpen(false);
  };
  return (
    <>
      <Modal
        width={props.width || "50%"}
        title={props.title || "Modal Title"}
        open={props.open}
        onOk={props.handleOk}
        confirmLoading={props.confirmLoading}
        onCancel={handleCancel}>
        {props.children}
      </Modal>
    </>
  );
};
export default AsyncModal;
