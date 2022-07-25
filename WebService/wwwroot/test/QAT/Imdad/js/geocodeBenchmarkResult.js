class GeocodeBenchmarkResult{
    constructor(addressText, addressCourierLocation, geocodedAddressText, geocodedAddressResultType, geocodedAddressLocation, geocodedAddressDistance, geocodedAddressProximity, geocodedAddressQueryScore, geocodedAddressMapGroupBoundingBox, geocodedAddressRemarks,
        
        placesAddressText, placesAddressLocation, placesAddressDistance, placesAddressProximity, placesAddressMapGroupBoundingBox, placesAddressRemarks){
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
        this.geocodedAddressRemarks = geocodedAddressRemarks;

        this.placesAddressText = placesAddressText;
        this.placesAddressLocation = placesAddressLocation;
        this.placesAddressDistance = placesAddressDistance;
        this.placesAddressProximity = placesAddressProximity;
        this.placesAddressMapGroupBoundingBox = placesAddressMapGroupBoundingBox;
        // this.placesAddressMapGroup = placesAddressMapGroup;
        this.placesAddressRemarks = placesAddressRemarks;
    }
}

export {GeocodeBenchmarkResult}