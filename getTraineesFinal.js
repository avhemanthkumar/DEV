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
data = [];
selection = [];

 

Columns = columns;

@wire(getTraineesList,{searchKey:'$searchKey'})
retrieveTrainees({error,data}){
    if(data){
        this.traineesList = data;
    }
    else if(error){

    }
}
rowSelection(evt) {
    // List of selected items from the data table event.
    let updatedItemsSet = new Set();
    // List of selected items we maintain.
    let selectedItemsSet = new Set(this.selection);
    // List of items currently loaded for the current view.
    let loadedItemsSet = new Set();


    this.data.map((event) => {
        loadedItemsSet.add(event.Id);
    });


    if (evt.detail.selectedRows) {
        evt.detail.selectedRows.map((event) => {
            updatedItemsSet.add(event.Id);
        });


        // Add any new items to the selection list
        updatedItemsSet.forEach((id) => {
            if (!selectedItemsSet.has(id)) {
                selectedItemsSet.add(id);
            }
        });        
    }


    loadedItemsSet.forEach((id) => {
        if (selectedItemsSet.has(id) && !updatedItemsSet.has(id)) {
            // Remove any items that were unselected.
            selectedItemsSet.delete(id);
        }
    });


    this.selection = [...selectedItemsSet];
    console.log('---selection---'+JSON.stringify(this.selection));
    
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
            message:'Trainess Added successfully! Refresh the Page.',
            variant:'Success',
            mode:'dismissable'
        });
        this.dispatchEvent(evt);
        setTimeout(
            function() {
                window.history.back();
            },
            10
        ); 
    })  
    .catch(error=>{  
      alert('Could not Add'+JSON.stringify(error));  
    })  
  }
  closeQuickAction() {
    this.dispatchEvent(new CloseActionScreenEvent());
}  

}
