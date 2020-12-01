import React, { useState } from 'react';
import { ServerActivity } from '../../../api/serverDataInterfaces';

const RatedActivities = () => {
  const [activites, setActivities] = useState<ServerActivity[] | null>(null);

  


  return (
    <div>
      Rated activities
    </div>
  );
};

export default RatedActivities;