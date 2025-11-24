import React from 'react';
import { Pressable } from 'react-native';
import { CheckCircleIcon as CheckCircle2Icon } from 'react-native-heroicons/outline';

// Simple Checkbox component since we don't have one in UI lib yet
function Checkbox({
  checked,
  onChange,
  className,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}) {
  return (
    <Pressable
      onPress={() => onChange(!checked)}
      className={`h-5 w-5 rounded border border-gray-300 items-center justify-center ${
        checked ? 'bg-primary border-primary' : 'bg-white'
      } ${className}`}
    >
      {checked && <CheckCircle2Icon size={14} color="white" />}
    </Pressable>
  );
}

export default Checkbox;
