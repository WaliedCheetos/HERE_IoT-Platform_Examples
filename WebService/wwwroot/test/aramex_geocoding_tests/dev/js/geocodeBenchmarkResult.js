class GeocodeBenchmarkResult{
    constructor(addressText, addressCourierLocation, geocodedAddressText, geocodedAddressResultType, geocodedAddressLocation, geocodedAddressDistance, geocodedAddressProximity, geocodedAddressQueryScore, geocodedAddressMapGroupBoundingBox, remarks){
    // constructor(addressText, addressCourierLocation, geocodedAddressText, geocodedAddressResultType, geocodedAddressLocation, geocodedAddressDistance, geocodedAddressProximity, geocodedAddressQueryScore, geocodedAddressMapGroup, remarks){
        this.addressText = addressText;
        this.addressCourierLocation = addressCourierLocation;
        this.geocodedAddressText = geocodedAddressText;
        this.geocodedAddressResultType = geocodedAddressResultType;
        this.geocodedAddressLocation = geocodedAddressLocation;
        this.geocodedAddressDistance = geocodedAddressDistance;
        this.geocodedAddressProximity = geocodedAddressProximity;
        this.geocodedAddressQueryScore = geocodedAddressQueryScore;
        this.geocodedAddressMapGroupBoundingBox = geocodedAddressMapGroupBoundingBox;
        // this.geocodedAddressMapGroup = geocodedAddressMapGroup;
        this.remarks = remarks;
    }
}

export {GeocodeBenchmarkResult}