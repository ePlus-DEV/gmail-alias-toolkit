interface InputProps {
  type?: 'text' | 'email' | 'number';
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  onKeyPress?: (e: React.KeyboardEvent) => void;
}

export default function Input({
  type = 'text',
  value,
  onChange,
  placeholder,
  label,
  disabled = false,
  onKeyPress,
}: InputProps) {
  return (
    <div>
      {label && (
        <label className="block text-xs font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={onKeyPress}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
}
