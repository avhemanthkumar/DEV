import { api, LightningElement, track, wire} from 'lwc';
import {refreshApex} from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import createTraineelineItems from '@salesforce/apex/getRecordDataController.createTraineelineItems';
import getTraineesList from '@salesforce/apex/getRecordDataController.getTraineesList';
import getTraineesData from '@salesforce/apex/getRecordDataController.getTraineesData';
import { CloseActionScreenEvent } from 'lightning/actions';
const columns = [
    { label: 'Name', fieldName: 'Name',type:'text' }];
const columns2= [
    { label: 'Name', fieldName: 'Name',type:'text' },
    { label: 'Id', fieldName: 'Id',type:'text' }
]

export default class GetTrainees extends LightningElement{

traineesList = [];
@track SelectedtraineesId = [];
@track SelectedtraineesName=[];
 SelectedtraineesList = [];
@api recordId;
searchKey = '';
data = [];
showText = false;
searchData;

 

Columns = columns;
Columns2 = columns2;

@wire(getTraineesList,{searchKey:'$searchKey'})
retrieveTrainees({error,data}){
    if(data){
        this.traineesList = data;
    }
    else if(error){

    }
}
handleClick(event){
    this.showText = true;
    getTraineesData({Ids : this.SelectedtraineesId})
        .then(result => {
            this.searchData = result;
            
        })
        .catch(error => {
            this.searchData = undefined;
            window.console.log('error =====> '+JSON.stringify(error));
            
        }) 

    
}

handleKeyChange(event) {

    const searchString = event.target.value;
    this.searchKey = searchString;
     
    
}

handleAccountClick(event) {
    const selectedAccId = event.detail.selectedRows;
    window.console.log('selectedAccId# ' + JSON.stringify(selectedAccId));
    this.selectedAccId=[];
    
    
    for (let i = 0; i<selectedAccId.length; i++){ 
        this.SelectedtraineesId.push(selectedAccId[i].Id);
        this.SelectedtraineesName.push(selectedAccId[i].Name);
        /*var Selectedtrainees = new Object ();
        Selectedtrainees.Name = this.SelectedtraineesName;
        Selectedtrainees.Id = this.SelectedtraineesId;
        this.SelectedtraineesList.push(Selectedtrainees);
        window.console.log(Selectedtrainees);*/
    }

    
    window.console.log(this.SelectedtraineesList);

}
addRecord(){    
    createTraineelineItems({selectedRecords: this.SelectedtraineesId, recordId:this.recordId})  
    .then(()=>{ 
        this.template.querySelector('lightning-datatable').selectedAccId=[]; 
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
