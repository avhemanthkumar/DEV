import { api, LightningElement, track, wire} from 'lwc';
import{refreshApex} from '@salesforce/apex';
import getTraineesData from '@salesforce/apex/getRecordDataController.getTraineesData';
import createTraineelineItems from '@salesforce/apex/getRecordDataController.createTraineelineItems';
const columns = [
    { label: 'Name', fieldName: 'Name',type:'text' }];

export default class GetTrainees extends LightningElement{

@track traineesList;
//@track SelectedtraineesList = [];
@api recordId;

 

Columns = columns;

//Method 2
@wire (getTraineesData) wiredTrainees({data,error}){
    if (data) {
         this.traineesList = data;
    console.log(data); 
    } else if (error) {
    console.log(error);
    }
}


getSelectedRec() {

    
    var selectedRecords =  

  this.template.querySelector("lightning-datatable").getSelectedRows();  

  console.log('selectedRecords are ',selectedRecords);
  this.traineesList = selectedRecords;
  createTraineelineItems ({selectedRecords: selectedRecords,recordId:this.recordId});
}
}
