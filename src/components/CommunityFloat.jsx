import React from 'react';
import { Link } from 'react-router-dom';

export default function CommunityFloat() {
  return (
    <Link
      className="community-float"
      to="/hello"
      aria-label="Walk with us"
    >
      🥭 Walk with us
    </Link>
  );
}
