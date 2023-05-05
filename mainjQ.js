$(document).ready(function(){
  $('#telefone').mask('(00) 0000-0000', {
    placeholder: '(00) 0000 - 0000' 
  })
  
  $('form').validate({
    rules:{
      nome:{required:true}, 
      email:{required:true, email:true},
      mensagem:{requerid:true}
    }, messages:{
      nome:'Campo Obrigatório',
      email:'Campo Obrigatório',
      mensagem:'Campo Obrigatório'
    }, submitHandler: function(form){
      alert(form)


    },
    invalidHandler:function(evento,validar){
      let campoIncorretos = validar.numberOfInvalids();
      if(campoIncorretos){
      alert(`Existem ${campoIncorretos} campos que não foram preenchidos`)
    }
    }
      
  
  
      
  })
})