import React, { memo } from "react";
import { Handle, Position } from "reactflow";

type CustomNodeProps = {
  data: {
    label: string;
  };
};

function CustomNode({ data }: CustomNodeProps) {
  return (
    <div className="indicator rounded-md shadow-2xl bg-gray-200 px-4 py-2">
      <div className="indicator-item badge badge-primary text-sm">train</div>
      <div className="text-sm">{data.label}</div>

      <Handle
        type="target"
        position={Position.Top}
        className="w-16 !bg-primary"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-16 !bg-primary"
      />
    </div>
  );
}

export default memo(CustomNode);
