'use client';

import ReactSelect from 'react-select';

interface SelectProps {
  value?: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  options: Record<string, any>[];
  disabled?: boolean;
}

const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  disabled,
}) => {
  return (
    <div className="z-[100]">
      <div className="mt-2">
        <ReactSelect
          isDisabled={disabled}
          value={value}
          onChange={onChange}
          isMulti
          options={options}
          menuPortalTarget={document.body}
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
            menuList: (base) => ({
              ...base,
              zIndex: 9999,
              pointerEvents: 'all', //? 모달 안에서 React-Select 사용 시, 커서가 안잡히는 문제 해결
            }),
          }}
          classNames={{
            control: () => 'text-sm',
          }}
        />
      </div>
    </div>
  );
};

export default Select;
