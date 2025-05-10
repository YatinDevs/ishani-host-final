import React from "react";
import HeroSection from "./HeroSection";
import OurProducts from "./OurProducts";
import GallerySection from "./GallerySection";
import FactoryDisplayOutlet from "./FactoryDisplayOutlet";
import FranchiseHighlight from "./FranchiseHighlight";
import WhoWeAre from "./WhoWeAre";

function Home() {
  return (
    <div>
      <HeroSection />
      <WhoWeAre />
      <OurProducts />
      <FactoryDisplayOutlet />
      <FranchiseHighlight />
      <GallerySection />
    </div>
  );
}

export default Home;
