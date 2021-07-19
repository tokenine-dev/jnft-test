
import { Label, Loading } from 'components';
import { IWork } from 'types';
import { ItemCard } from 'components/ItemCard'

type itemFeedsProps = {
     labelTitle?: string;
     labelLinkname?: string;
     works?: IWork[] | []
};

export default function ItemFeeds(props: itemFeedsProps) {
     const { labelTitle = '', labelLinkname, works } = props;
     const page = {
          id: labelTitle.replace(' ', '').toLowerCase()
     }

     const items = works || []

     return (
          <div id="feeds">
               <div className="body-container">
                    <div className="body-wrapper">
                         <Label title={`${labelTitle}`} linkName={labelLinkname ? labelLinkname : ''} />
                         <div id="present-art-items" className="body-wrapper-content">
                              {items?.map((el: any) => (
                                   <ItemCard data={{ page, item: el }} />
                              ))}
                         </div>
                    </div>
               </div>
          </div>
     );
}
