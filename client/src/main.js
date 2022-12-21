const app = angular.module("app", []);

const alert = document.querySelector('.js-alert')
const modalConfirm = document.querySelector('.js-modal-confirm')
const dropdown = document.querySelector('.js-dropdown')
const dropdownList = document.querySelector('.js-dropdown-list')

const form = document.querySelector(".js-form")
const inputs = document.querySelectorAll(".js-input")
const emailInput = document.querySelector("[name='mail']");
const passwordInput = document.querySelector("[name='password']");
const nameInput = document.querySelector("[name='name']");
const nicknameInput = document.querySelector("[name='nickname']");
const confirmPasswordInput = document.querySelector("[name='confirmPassword']");
//const error = email.nextElementSibling;}
console.log(inputs)

const emailRegExp =
/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isRequired = (input, label) => input.value.length !== 0 ? '' : `El campo ${label} es requerido`

const isFormatEmail = (input, label) => emailRegExp.test(input.value) ? '' : `El formato ${label} no está permitido`

const configRules = {
  mail: [isRequired, isFormatEmail],
  password: [isRequired],
  name: [isRequired],
  nickname: [isRequired],
  confirmPassword: [isRequired]
}

const validate = (input) => {
  const error = input.nextElementSibling;
  const label = input.dataset.label
  const validateRules = configRules[input.name]

  if (validateRules && validateRules.length > 0) {
    for (let i = 0; i < validateRules.length; i++) {
      const rule = validateRules[i]
      const isRuleValid = rule(input, label )
      if (isRuleValid) {
        console.log('entre')
        input.classList.add('is-invalid')
        error.textContent = isRuleValid;
        error.classList.add('error')
        break
      } else {
        console.log('no enre')
        input.classList.remove('is-invalid')
        error.textContent = label;
        error.classList.remove('error')
      }
    }
  }
}

const handleInputForm = (e) =>{
  const input = e.currentTarget
  validate(input)
}

window.addEventListener("load", () => {
  console.log(inputs, 'inputs')
  inputs.forEach((input) => {
    input.addEventListener('input', handleInputForm, false )
  })
});
app.controller("formLoginCtrl", ($scope, $http) => {
  $scope.user = {}
  $scope.handleSubmit = () => {
    inputs.forEach((input) => {
      validate(input)
    })
    if (
      emailInput.classList.contains('is-invalid') ||
      passwordInput.classList.contains('is-invalid')
    ) {
      return
    }
    console.log(emailInput, 'emilInput')
      $scope.isLoadingLogin = true
      $http.post("http://localhost:9000/api/user/login", $scope.user)
      .then(function(response) {
        $scope.isLoadingLogin = false
        const data = response.data
        sessionStorage.setItem('user', JSON.stringify(data))
        if (data && data._id) {
            window.location.href = 'pokemonFavorite.html'
        } else {
          $scope.errorLogin = `Intente nuevamente`
        }
      });
  };
});

app.controller("favoritesCtrl", ($scope, $http) => {
  const userStorage = JSON.parse(sessionStorage.getItem('user'))
  if (!userStorage) {
    return window.location.href = 'login.html'
  }


  $http.get(`http://localhost:9000/api/user/${userStorage._id}/pokemon/favorites`)
    .then(function(response) {
      const data = response.data
      console.log(data, 'data')
      let auxList = []
      data.forEach(item => {
          $http
            .get(`https://pokeapi.co/api/v2/pokemon/${item.name}`)
            .then((response) => {
              const data = response.data
              data._id = item._id
              data.image = data.sprites.other['official-artwork']['front_default']
              auxList.push(data)
            })
      })
      $scope.pokemonFavorite = auxList
      
    });



  $scope.handleClickDelete = (pokemonId) => {
    $scope.isLoadingPokemonDelete = true
    $http.delete(`http://localhost:9000/api/user/${userStorage._id}/pokemon/favorites/${pokemonId}`)
      .then(function(response) {
        $scope.isLoadingPokemonDelete = false
        const data = response.data
        if (data) {
            window.location.href = 'pokemonFavorite.html'
        }
      });
  }

  $scope.handleClickLogout = () => {
    sessionStorage.removeItem('user')
    window.location.href = 'login.html'
  }
});

app.controller("pokemonListCtrl", ($scope, $http, $timeout) => {
  const userStorage = JSON.parse(sessionStorage.getItem('user'))
  if (!userStorage) {
    return window.location.href = 'login.html'
  }

  $http.get(`http://localhost:9000/api/user/${userStorage._id}`)
    .then((response) => {
      $http.get(`http://localhost:9000/api/pokemon`)
        .then(function(response) {
          const data = response.data
          $scope.pokemonList = data

        })
    })


    $scope.handleClickAddFavorite = (pokemonId, isFavorite) => {
      const userStorage = JSON.parse(sessionStorage.getItem('user'))
      if (!isFavorite) {
        $http
          .put(`http://localhost:9000/api/user/${userStorage._id}/pokemon/favorites`, {
            favoriteId: pokemonId
          })
          .then((response) => {
            const data = response.data
            if (data) {
                window.location.href = 'pokemonList.html'
            }
          })
      } else {
        $http.delete(`http://localhost:9000/api/user/${userStorage._id}/pokemon/favorites/${pokemonId}`)
        .then(function(response) {
          const data = response.data
          if (data) {
              window.location.href = 'pokemonList.html'
          }
        });
      }
    }

    $scope.handleClickLogout = () => {
      sessionStorage.removeItem('user')
      window.location.href = 'login.html'
    }

    $scope.handleClickDropdown = () => {
      const list = dropdown.querySelector('ul')
      list.classList.toggle('show')

    }
    $scope.handleClickDropdownList = ($event) => {
      console.log($event.target, 'evetn')
      $http.get(`http://localhost:9000/api/user/${userStorage._id}`)
      .then((response) => {
        const favorites = response.data.favorites
        $http
        .get(`http://localhost:9000/api/pokemon/${$event.target.dataset.href}`)
        .then((response) => {
          const pokeBd = response.data
          $http.get(`https://pokeapi.co/api/v2/pokemon/${$event.target.textContent}`)
            .then((response) => {
              const pokeApi = response.data
              pokeBd.image = pokeApi.sprites.other['official-artwork']['front_default']
              pokeBd.favorite = favorites.includes(pokeBd._id)
              $scope.pokemon = pokeBd
            })
        })
      })

    }
})

app.controller("formProfileCtrl", ($scope, $http) => {
  const userStorage = JSON.parse(sessionStorage.getItem('user'))
  if ((!userStorage || !userStorage._id) && !userStorage.modifiedCount ) {
    return window.location.href = 'login.html'
  }

  $http.get(`http://localhost:9000/api/user/${userStorage._id}`)
    .then(function(response) {
      const data = response.data
      $scope.name = data.name
      $scope.mail = data.mail
      $scope.nickname = data.nickname
      $scope.password = data.password
      $scope.confirmPassword = data.confirmPassword
    });

    $scope.handleClickUpdate = () => {
      inputs.forEach((input) => {
        validate(input)
      })
      if (
        emailInput.classList.contains('is-invalid') ||
        passwordInput.classList.contains('is-invalid') ||
        nameInput.classList.contains('is-invalid') ||
        nicknameInput.classList.contains('is-invalid') ||
        passwordInput.classList.contains('is-invalid') ||
        confirmPasswordInput.classList.contains('is-invalid') 
      ) {
        return
      }
      modalConfirm.classList.add('show')
    }

    $scope.handleClickLogout = () => {
      sessionStorage.removeItem('user')
      window.location.href = 'login.html'
    }

    $scope.handleClickModalCancel = () => {
      modalConfirm.classList.remove('show')
      modalConfirm.classList.remove('delete-account')

    }
    $scope.handleClickModalAccept = () => {
      console.log(alert)
      if (modalConfirm.classList.contains('delete-account')) {
        $http.delete(`http://localhost:9000/api/user/${userStorage._id}`)
          .then((response) => {
            const data = response.data
            if (data) {
              $scope.alertMessage = 'Se ha eliminado la cuenta'
              alert.classList.add('alert-success')
              setTimeout(() => {
                window.location.href="login.html"
              }, 1000)
            } else {
              $scope.alertMessage = 'Algo salió mal. Intente nuevamente'
              alert.classList.add('alert-danger')
              setTimeout(() => {
                alert.classList.add('visually-hidden')
              }, 1000)
            }
          })
        return
      }
      $http.put(`http://localhost:9000/api/user/${userStorage._id}`, {
        "name": $scope.name,
        "mail": $scope.mail,
        "nickname": $scope.nickname,
        "password": $scope.password,
        "confirmPassword": $scope.confirmPassword
      })
      .then(function(response) {
        modalConfirm.classList.remove('show')
        const data = response.data
        alert.classList.remove('visually-hidden')
        if (data) {
          $scope.alertMessage = 'Actualización Exitoso'
          alert.classList.add('alert-success')
          setTimeout(() => {
            alert.classList.add('visually-hidden')
          }, 1000)
        } else {
          $scope.alertMessage = 'Algo salió mal. Intente nuevamente'
          alert.classList.add('alert-danger')
          setTimeout(() => {
            alert.classList.add('visually-hidden')
          }, 1000)
        }
      });
    }
    $scope.handleClickDeleteAccount = () => {
      console.log(alert)
      $scope.confirMessage = 'Eliminar'
      modalConfirm.classList.add('delete-account')
      modalConfirm.classList.add('show')

    }
})

app.controller("formRegisterCtrl", ($scope, $http) => {

  $scope.handleClickRegister = () => {
    inputs.forEach((input) => {
      validate(input)
    })
    if (
      emailInput.classList.contains('is-invalid') ||
      passwordInput.classList.contains('is-invalid') ||
      nameInput.classList.contains('is-invalid') ||
      nicknameInput.classList.contains('is-invalid') ||
      passwordInput.classList.contains('is-invalid') ||
      confirmPasswordInput.classList.contains('is-invalid') 
    ) {
      return
    }
    $scope.isLoadingRegister = true
    $http.post("http://localhost:9000/api/user/register", {
      "name": $scope.name,
      "mail": $scope.mail,
      "nickname": $scope.nickname,
      "password": $scope.password,
      "confirmPassword": $scope.confirmPassword
    })
    .then(function(response) {
      $scope.isLoadingRegister = false
      const data = response.data
      sessionStorage.setItem('user', JSON.stringify(data))
      alert.classList.remove('visually-hidden')
      if (data) {
        $scope.alertMessage = 'Registro Exitoso'
        alert.classList.add('alert-success')
        setTimeout(() => {
          window.location.href = 'pokemonList.html'
        }, 500)
      } else {
        $scope.alertMessage = 'Algo salió mal. Intente nuevamente'
        alert.classList.add('alert-danger')
        setTimeout(() => {
          alert.classList.add('visually-hidden')
        }, 500)
      }
    });
  };


})