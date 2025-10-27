import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Textarea } from './textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Switch } from './switch';

const FormField = ({ 
  label, 
  children, 
  error, 
  required = false,
  className = "" 
}) => (
  <div className={`space-y-2 ${className}`}>
    <Label className="text-white text-sm font-medium">
      {label}
      {required && <span className="text-red-400 ml-1">*</span>}
    </Label>
    {children}
    {error && (
      <p className="text-red-400 text-xs">{error}</p>
    )}
  </div>
);

const FormGroup = ({ children, className = "" }) => (
  <div className={`space-y-4 ${className}`}>
    {children}
  </div>
);

const FormRow = ({ children, className = "" }) => (
  <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
    {children}
  </div>
);

const FormActions = ({ children, className = "" }) => (
  <div className={`flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-700/50 ${className}`}>
    {children}
  </div>
);

const ResponsiveForm = ({ 
  children, 
  onSubmit, 
  className = "" 
}) => (
  <motion.form
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    onSubmit={onSubmit}
    className={`space-y-6 ${className}`}
  >
    {children}
  </motion.form>
);

const FormInput = ({ 
  label, 
  error, 
  required = false,
  className = "",
  ...props 
}) => (
  <FormField label={label} error={error} required={required}>
    <Input
      className={`bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 ${className}`}
      {...props}
    />
  </FormField>
);

const FormTextarea = ({ 
  label, 
  error, 
  required = false,
  className = "",
  ...props 
}) => (
  <FormField label={label} error={error} required={required}>
    <Textarea
      className={`bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 ${className}`}
      {...props}
    />
  </FormField>
);

const FormSelect = ({ 
  label, 
  error, 
  required = false,
  options = [],
  className = "",
  ...props 
}) => (
  <FormField label={label} error={error} required={required}>
    <Select {...props}>
      <SelectTrigger className={`bg-gray-700/50 border-gray-600 text-white ${className}`}>
        <SelectValue placeholder="Sélectionner..." />
      </SelectTrigger>
      <SelectContent className="bg-gray-900 border-gray-700">
        {options.map(option => (
          <SelectItem 
            key={option.value} 
            value={option.value} 
            className="text-white hover:bg-gray-800"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </FormField>
);

const FormSwitch = ({ 
  label, 
  error, 
  className = "",
  ...props 
}) => (
  <FormField label={label} error={error}>
    <div className={`flex items-center justify-between p-4 bg-gray-800/50 rounded-lg ${className}`}>
      <Label className="text-white text-sm font-medium">{label}</Label>
      <Switch {...props} />
    </div>
  </FormField>
);

export {
  ResponsiveForm,
  FormField,
  FormGroup,
  FormRow,
  FormActions,
  FormInput,
  FormTextarea,
  FormSelect,
  FormSwitch
};
export default ResponsiveForm;
