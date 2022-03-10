import { api, LightningElement, track, wire} from 'lwc';
import {refreshApex} from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import createTraineelineItems from '@salesforce/apex/getRecordDataController.createTraineelineItems';
import getTraineesList from '@salesforce/apex/getRecordDataController.getTraineesList';
import { CloseActionScreenEvent } from 'lightning/actions';
const columns = [
    { label: 'Name', fieldName: 'Name',type:'text' }];

export default class GetTrainees extends LightningElement{

@track traineesList = [];
//@track SelectedtraineesList = [];
@api recordId;
searchKey = '';

 

Columns = columns;

@wire(getTraineesList,{searchKey:'$searchKey'})
retrieveTrainees({error,data}){
    if(data){
        this.traineesList = data;
    }
    else if(error){

    }
}

handleKeyChange(event) {

    this.searchKey = event.target.value;
     
    
}
addRecord(){  
    var selectedRecords =  
     this.template.querySelector("lightning-datatable").getSelectedRows();  
     createTraineelineItems({selectedRecords: selectedRecords, recordId:this.recordId})  
    .then(result=>{  
        const evt = new ShowToastEvent({
            title:'Success Message',
            message:'Trainess Added successfully! Close the pop-up and refresh the Page.',
            variant:'Success',
            mode:'dismissable'
        });
        this.dispatchEvent(evt);
      return refreshApex(this.traineesList);  
    })  
    .catch(error=>{  
      alert('Could not Add'+JSON.stringify(error));  
    })  
  }
  closeQuickAction() {
    this.dispatchEvent(new CloseActionScreenEvent());
}  

}
