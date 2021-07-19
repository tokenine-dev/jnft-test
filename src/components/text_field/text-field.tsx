type propInput = {
     label: string
     name: string
     id: string
     placeholder: string
     onChange: any
     type: string
     min?: string
     value?: string
};

export default function TextField(props: propInput) {
     const { label, name, onChange, id, placeholder, type = "text", min, value } = props;
     return (
          <div id={`textField`}>
               <label className="text-base block font-bold" htmlFor="validationCustom01">
                    {label}
               </label>
               {type === 'text' || type === 'number' ? (
                    <input
                         onChange={onChange}
                         required
                         placeholder={placeholder}
                         type={type}
                         id={id}
                         name={name}
                         min={min}
                         value={value || ''}
                         className="w-full flex-none text-base leading-6 font-normal py-3 px-2 border-2 border-gray-900 hover:border-gray-900 rounded-md focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-gray-900 focus:outline-none transition-colors duration-200 block"
                    />
               ) : type === 'text-area' ? (
                    <textarea
                         onChange={onChange}
                         placeholder={placeholder}
                         id={id}
                         name={name}
                         value={value || ''}
                         className="custom:h-textarea w-full flex-none text-base leading-6 font-normal h-60 py-3 px-2 border-2 border-gray-900 hover:border-gray-900 rounded-md focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-gray-900 focus:outline-none transition-colors duration-200 block"
                         aria-label="With textarea"
                         spellCheck="false"
                    />
               ) : null}
          </div>
     );
}
