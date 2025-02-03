import { Select } from "antd";

const MultiSelect = () => {
  const { Option } = Select;
  function handleChange(value) {
    console.log(`selected ${value}`);
  }

  return (
    <Select
      mode="multiple"
      style={{ width: "100%" }}
      placeholder="select one or more purchase"
      onChange={handleChange}
      optionLabelProp="label">
      <Option value="china" label="China">
        <span role="img" aria-label="China">
          🇨🇳
        </span>
        China (中国)
      </Option>
      <Option value="usa" label="USA">
        <span role="img" aria-label="USA">
          🇺🇸
        </span>
        USA (美国)
      </Option>
      <Option value="japan" label="Japan">
        <span role="img" aria-label="Japan">
          🇯🇵
        </span>
        Japan (日本)
      </Option>
      <Option value="korea" label="Korea">
        <span role="img" aria-label="Korea">
          🇰🇷
        </span>
        Korea (韩国)
      </Option>
    </Select>
  );
};

export default MultiSelect;
