import React from 'react';
import { Link } from 'react-router-dom';
// import { Form } from 'react-bootstrap';

type LabelProps = {
     id?: string;
     title: string;
     linkName?: string;
     labelStyle?: string;
     onClickLabel?: () => void;
};

const Label = ({ id, title, linkName, labelStyle, onClickLabel }: LabelProps) => {
     return (
          <div className="label">
               <h2 className="title">{title}</h2>
               <div>
                    <Link to="/nft-market" className={labelStyle === "link" ? 'link-btn' : ''}>
                         {linkName}
                    </Link>
               </div>
          </div>
     );
};

export default Label;
